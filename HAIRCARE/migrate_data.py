import json
import sqlite3
import os
from db import get_db_connection

# Mapping products to high-quality Unsplash images (better choices)
# I'll use specific keywords for each product type
PRODUCT_IMAGE_MAP = {
    "Shampoo": "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?q=80&w=2070&auto=format&fit=crop",
    "Conditioner": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=2070&auto=format&fit=crop",
    "Treatment": "https://images.unsplash.com/photo-1571781926291-280553dd4e54?q=80&w=2070&auto=format&fit=crop",
    "Serum": "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=2070&auto=format&fit=crop",
    "Styling": "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=2070&auto=format&fit=crop",
    "Oil": "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?q=80&w=2070&auto=format&fit=crop",
    "Supplement": "https://images.unsplash.com/photo-1584362917165-526a968f79f9?q=80&w=2070&auto=format&fit=crop",
    "Kit": "https://images.unsplash.com/photo-1556228720-1957be97985d?q=80&w=2070&auto=format&fit=crop"
}

def migrate():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Clear existing data to avoid duplicates
    cursor.execute("DELETE FROM products")
    cursor.execute("DELETE FROM users")
    cursor.execute("DELETE FROM orders")
    print("Existing data cleared.")

    # Migrate Users
    users_file = "users.json"
    if os.path.exists(users_file):
        with open(users_file, "r") as f:
            users_data = json.load(f)
            for email, data in users_data.items():
                # Check if user already exists
                cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
                if not cursor.fetchone():
                    cursor.execute('''
                        INSERT INTO users (email, password, name, totp_secret, verified, tfa_enabled, role)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        email, 
                        data.get("password"), 
                        data.get("name"), 
                        data.get("totp_secret"), 
                        data.get("verified", False), 
                        data.get("tfa_enabled", False),
                        "admin" if "admin" in email.lower() else "user" # Simple rule for now
                    ))
        print("Users migrated successfully.")

    # Migrate Products
    products_file = "products.json"
    if os.path.exists(products_file):
        with open(products_file, "r") as f:
            products_data = json.load(f)
            for p in products_data:
                # Use mapped image or default if category not found
                img_url = PRODUCT_IMAGE_MAP.get(p.get("category"), p.get("imageUrl"))
                
                cursor.execute('''
                    INSERT INTO products (name, category, description, hairType, imageUrl, retailPrice, nonPremiumWholesalePrice, premiumWholesalePrice)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    p.get("name"),
                    p.get("category"),
                    p.get("description"),
                    p.get("hairType"),
                    img_url,
                    p.get("retailPrice"),
                    p.get("nonPremiumWholesalePrice"),
                    p.get("premiumWholesalePrice")
                ))
        print("Products migrated successfully with updated images.")

    # Migrate Orders
    orders_file = "orders.json"
    if os.path.exists(orders_file):
        with open(orders_file, "r") as f:
            try:
                orders_data = json.load(f)
                for order in orders_data:
                    cursor.execute('''
                        INSERT INTO orders (order_id, customer_email, data)
                        VALUES (?, ?, ?)
                    ''', (
                        order.get("orderId"),
                        order.get("customer", {}).get("email"),
                        json.dumps(order)
                    ))
                print("Orders migrated successfully.")
            except:
                print("No orders to migrate or error reading orders.json")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    migrate()
