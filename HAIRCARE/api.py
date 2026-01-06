import json
import os
import pyotp
import qrcode
import io
import base64
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load products once at startup
products_file = os.path.join(os.path.dirname(__file__), "products.json")
try:
    with open(products_file, "r") as f:
        PRODUCTS = json.load(f)
except Exception as e:
    print(f"Error loading products.json: {e}")
    PRODUCTS = []

# Mock database for users
USERS_FILE = os.path.join(os.path.dirname(__file__), "users.json")
def load_users():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, "r") as f:
            return json.load(f)
    return {}

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=2)

@app.get("/api/hello")
def hello():
    return {"message": "hello from HAIRCARE API"}

@app.get("/api/products")
def get_products():
    return jsonify(PRODUCTS)

@app.post("/api/register")
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")  # In real app, hash this!
    
    users = load_users()
    if email in users:
        return jsonify({"error": "User already exists"}), 400
        
    # Generate TOTP secret
    totp_secret = pyotp.random_base32()
    
    users[email] = {
        "email": email,
        "password": password,
        "totp_secret": totp_secret,
        "verified": False,
        "tfa_enabled": False,
        "name": data.get("name", "")
    }
    save_users(users)
    
    # Generate provisioning URI for QR code
    totp = pyotp.TOTP(totp_secret)
    provisioning_uri = totp.provisioning_uri(name=email, issuer_name="HAIRCARE.CO.NZ")
    
    # Generate QR code as base64
    img = qrcode.make(provisioning_uri)
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    return jsonify({
        "message": "Registration initiated",
        "provisioning_uri": provisioning_uri,
        "qr_code": f"data:image/png;base64,{img_str}",
        "email": email
    })

@app.post("/api/verify-registration")
def verify_registration():
    data = request.json
    email = data.get("email")
    code = data.get("code")
    
    users = load_users()
    user = users.get(email)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    totp = pyotp.TOTP(user["totp_secret"])
    if totp.verify(code):
        user["verified"] = True
        user["tfa_enabled"] = True
        save_users(users)
        return jsonify({"message": "2FA Verified. Registration complete.", "user": {"email": email, "name": user["name"]}})
    else:
        return jsonify({"error": "Invalid verification code"}), 400

@app.post("/api/skip-2fa")
def skip_2fa():
    data = request.json
    email = data.get("email")
    users = load_users()
    user = users.get(email)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    user["verified"] = True
    user["tfa_enabled"] = False
    save_users(users)
    return jsonify({"message": "2FA skipped. Registration complete.", "user": {"email": email, "name": user["name"]}})

@app.post("/api/login")
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    
    users = load_users()
    user = users.get(email)
    
    if user and user["password"] == password:
        if not user["verified"]:
             return jsonify({"error": "Please complete registration setup"}), 400
        
        if user.get("tfa_enabled"):
            return jsonify({"message": "Credentials valid, please enter 2FA code", "email": email, "tfa_required": True})
        else:
            return jsonify({
                "message": "Login successful", 
                "user": {"email": email, "name": user.get("name", "")},
                "tfa_required": False
            })
    
    return jsonify({"error": "Invalid email or password"}), 401

@app.post("/api/orders")
def create_order():
    order_data = request.json
    # Same as before...
    order_data = request.json
    
    # Basic validation
    required_fields = ["items", "customer", "paymentMethod", "subtotal", "shipping", "total"]
    for field in required_fields:
        if field not in order_data:
            return jsonify({"error": f"Missing required field: {field}"}), 400
            
    # Log order
    print("New Order Received:")
    print(json.dumps(order_data, indent=2))
    
    # Save to orders.json
    orders_file = os.path.join(os.path.dirname(__file__), "orders.json")
    orders = []
    if os.path.exists(orders_file):
        try:
            with open(orders_file, "r") as f:
                orders = json.load(f)
        except:
            orders = []
    
    orders.append(order_data)
    with open(orders_file, "w") as f:
        json.dump(orders, f, indent=2)
        
    return jsonify({
        "status": "pending_payment", 
        "orderId": f"ORD-{len(orders):05d}"
    })

if __name__ == "__main__":
    app.run(port=8000, debug=True)
