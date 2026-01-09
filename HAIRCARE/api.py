import json
import os
import pyotp
import qrcode
import io
import base64
from flask import Flask, jsonify, request
from flask_cors import CORS
from db import get_db_connection

app = Flask(__name__)
CORS(app)

@app.get("/api/hello")
def hello():
    return {"message": "hello from HAIRCARE API"}

@app.get("/api/products")
def get_products():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products")
    products = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(products)

@app.post("/api/register")
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    name = data.get("name", "")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if user exists
    cursor.execute("SELECT id, verified FROM users WHERE email = ?", (email,))
    existing_user = cursor.fetchone()
    
    # If user exists but is not verified, delete them (allow re-registration)
    if existing_user and not existing_user["verified"]:
        cursor.execute("DELETE FROM users WHERE email = ?", (email,))
        conn.commit()
    elif existing_user:
        conn.close()
        return jsonify({"error": "User already exists"}), 400
        
    # Generate a TOTP secret for future use (but don't require it now)
    totp_secret = pyotp.random_base32()
    role = "admin" if "admin" in email.lower() else "user"
    
    # Insert user as VERIFIED and without 2FA enabled
    cursor.execute('''
        INSERT INTO users (
            email, password, name, totp_secret, verified, tfa_enabled, role,
            address, city, zip, country, phone
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        email, 
        password, 
        name, 
        totp_secret, 
        1,  # Set verified to true immediately
        0,  # 2FA disabled
        role,
        data.get("address", ""),
        data.get("city", ""),
        data.get("zip", ""),
        data.get("country", ""),
        data.get("phone", "")
    ))
    conn.commit()
    conn.close()
    
    # Return user data immediately (no QR code needed)
    return jsonify({
        "message": "Registration successful",
        "user": {
            "email": email,
            "name": name,
            "role": role,
            "address": data.get("address", ""),
            "city": data.get("city", ""),
            "zip": data.get("zip", ""),
            "country": data.get("country", ""),
            "phone": data.get("phone", "")
        }
    })

@app.post("/api/verify-registration")
def verify_registration():
    data = request.json
    email = data.get("email")
    code = data.get("code")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    
    if not user:
        conn.close()
        return jsonify({"error": "User not found"}), 404
        
    totp = pyotp.TOTP(user["totp_secret"])
    if totp.verify(code):
        cursor.execute("UPDATE users SET verified = 1, tfa_enabled = 1 WHERE email = ?", (email,))
        conn.commit()
        conn.close()
        return jsonify({"message": "2FA Verified. Registration complete.", "user": {
            "email": email, 
            "name": user["name"], 
            "role": user["role"],
            "address": user["address"],
            "city": user["city"],
            "zip": user["zip"],
            "country": user["country"],
            "phone": user["phone"]
        }})
    else:
        conn.close()
        return jsonify({"error": "Invalid verification code"}), 400

@app.post("/api/skip-2fa")
def skip_2fa():
    data = request.json
    email = data.get("email")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    
    if not user:
        conn.close()
        return jsonify({"error": "User not found"}), 404
        
    cursor.execute("UPDATE users SET verified = 1, tfa_enabled = 0 WHERE email = ?", (email,))
    conn.commit()
    conn.close()
    return jsonify({"message": "2FA skipped. Registration complete.", "user": {
        "email": email, 
        "name": user["name"], 
        "role": user["role"],
        "address": user["address"],
        "city": user["city"],
        "zip": user["zip"],
        "country": user["country"],
        "phone": user["phone"]
    }})

@app.post("/api/login")
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()
    
    if user and user["password"] == password:
        if not user["verified"]:
             return jsonify({"error": "Please complete registration setup"}), 400
        
        if user["tfa_enabled"]:
            # Check if 2FA code is provided in request
            code = data.get("code")
            if code:
                 totp = pyotp.TOTP(user["totp_secret"])
                 if totp.verify(code):
                      return jsonify({
                        "message": "Login successful", 
                        "user": {
                            "email": email, 
                            "name": user["name"], 
                            "role": user["role"],
                            "address": user["address"],
                            "city": user["city"],
                            "zip": user["zip"],
                            "country": user["country"],
                            "phone": user["phone"]
                        },
                        "tfa_required": False
                    })
                 else:
                     return jsonify({"error": "Invalid 2FA code"}), 400

            return jsonify({"message": "Credentials valid, please enter 2FA code", "email": email, "tfa_required": True})
        else:
            return jsonify({
                "message": "Login successful", 
                "user": {
                    "email": email, 
                    "name": user["name"], 
                    "role": user["role"],
                    "address": user["address"],
                    "city": user["city"],
                    "zip": user["zip"],
                    "country": user["country"],
                    "phone": user["phone"]
                },
                "tfa_required": False
            })
    
    return jsonify({"error": "Invalid email or password"}), 401

@app.post("/api/orders")
def create_order():
    order_data = request.json # Basic validation
    required_fields = ["items", "customer", "paymentMethod", "subtotal", "shipping", "total"]
    for field in required_fields:
        if field not in order_data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
            
    # For guests, ensure shipping info is present in 'customer' object
    # The frontend should send: { email, name, address, city, zip, country, phone }
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    order_id = f"ORD-{os.urandom(4).hex().upper()}"
    cursor.execute('''
        INSERT INTO orders (order_id, customer_email, data)
        VALUES (?, ?, ?)
    ''', (order_id, order_data.get("customer", {}).get("email"), json.dumps(order_data)))
    
    conn.commit()
    conn.close()
        
    return jsonify({
        "status": "pending_payment", 
        "orderId": order_id
    })

# Admin Endpoints
@app.get("/api/admin/users")
def admin_get_users():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    users = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(users)

@app.post("/api/admin/users")
def admin_add_user():
    data = request.json
    email = data.get("email")
    password = data.get("password", "tempPass123") # Default password if not provided
    name = data.get("name", "")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if user exists
    cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
    if cursor.fetchone():
        conn.close()
        return jsonify({"error": "User with this email already exists"}), 400
        
    totp_secret = pyotp.random_base32()
    role = data.get("role", "user")
    
    cursor.execute('''
        INSERT INTO users (
            email, password, name, totp_secret, verified, tfa_enabled, role,
            address, city, zip, country, phone
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        email, 
        password, 
        name, 
        totp_secret, 
        1,  # Verified by admin
        0,  # 2FA disabled by default
        role,
        data.get("address", ""),
        data.get("city", ""),
        data.get("zip", ""),
        data.get("country", ""),
        data.get("phone", "")
    ))
    conn.commit()
    conn.close()
    return jsonify({"message": "User added successfully"})

@app.put("/api/admin/users/<int:user_id>")
def admin_update_user(user_id):
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    
    password = data.get("password")
    
    if password:
        cursor.execute('''
            UPDATE users 
            SET name=?, email=?, role=?, verified=?, tfa_enabled=?, address=?, city=?, zip=?, country=?, phone=?, password=?
            WHERE id=?
        ''', (
            data.get("name"),
            data.get("email"),
            data.get("role"),
            data.get("verified"),
            data.get("tfa_enabled"),
            data.get("address"),
            data.get("city"),
            data.get("zip"),
            data.get("country"),
            data.get("phone"),
            password,
            user_id
        ))
    else:
        cursor.execute('''
            UPDATE users 
            SET name=?, email=?, role=?, verified=?, tfa_enabled=?, address=?, city=?, zip=?, country=?, phone=?
            WHERE id=?
        ''', (
            data.get("name"),
            data.get("email"),
            data.get("role"),
            data.get("verified"),
            data.get("tfa_enabled"),
            data.get("address"),
            data.get("city"),
            data.get("zip"),
            data.get("country"),
            data.get("phone"),
            user_id
        ))
    conn.commit()
    conn.close()
    return jsonify({"message": "User updated successfully"})

@app.post("/api/admin/products")
def admin_add_product():
    data = request.json
    
    # Calculate appliedNewRetailRate logic
    retail = float(data.get("retailPrice", 0))
    discount = float(data.get("discountRate", 0))
    new_rate = retail * (1 - discount / 100) if discount > 0 else retail

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO products (
            name, category, description, hairType, imageUrl, 
            retailPrice, nonPremiumWholesalePrice, premiumWholesalePrice,
            discountRate, appliedNewRetailRate
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data.get("name"),
        data.get("category"),
        data.get("description"),
        data.get("hairType"),
        data.get("imageUrl"),
        retail,
        data.get("nonPremiumWholesalePrice"),
        data.get("premiumWholesalePrice"),
        discount,
        new_rate
    ))
    conn.commit()
    conn.close()
    return jsonify({"message": "Product added successfully"})

@app.put("/api/admin/products/<int:id>")
def admin_update_product(id):
    data = request.json
    
    retail = float(data.get("retailPrice", 0))
    discount = float(data.get("discountRate", 0))
    new_rate = retail * (1 - discount / 100) if discount > 0 else retail

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE products 
        SET name=?, category=?, description=?, hairType=?, imageUrl=?, 
            retailPrice=?, nonPremiumWholesalePrice=?, premiumWholesalePrice=?,
            discountRate=?, appliedNewRetailRate=?
        WHERE id=?
    ''', (
        data.get("name"),
        data.get("category"),
        data.get("description"),
        data.get("hairType"),
        data.get("imageUrl"),
        retail,
        data.get("nonPremiumWholesalePrice"),
        data.get("premiumWholesalePrice"),
        discount,
        new_rate,
        id
    ))
    conn.commit()
    conn.close()
    return jsonify({"message": "Product updated successfully"})

@app.delete("/api/admin/products/<int:id>")
def admin_delete_product(id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM products WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Product deleted successfully"})

if __name__ == "__main__":
    app.run(port=8000, debug=True)
