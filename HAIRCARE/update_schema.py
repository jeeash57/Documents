import sqlite3
import os
import db

def update_schema():
    conn = db.get_db_connection()
    cursor = conn.cursor()
    
    # Add columns to users if they don't exist
    user_columns = [
        ("address", "TEXT"),
        ("city", "TEXT"),
        ("zip", "TEXT"),
        ("country", "TEXT"),
        ("phone", "TEXT")
    ]
    
    for col, type_ in user_columns:
        try:
            cursor.execute(f"ALTER TABLE users ADD COLUMN {col} {type_}")
            print(f"Added column {col} to users table.")
        except sqlite3.OperationalError:
            print(f"Column {col} already exists in users table.")

    # Add columns to products if they don't exist
    product_columns = [
        ("discountRate", "REAL DEFAULT 0"),
        ("appliedNewRetailRate", "REAL")
    ]

    for col, type_ in product_columns:
        try:
            cursor.execute(f"ALTER TABLE products ADD COLUMN {col} {type_}")
            print(f"Added column {col} to products table.")
        except sqlite3.OperationalError:
            print(f"Column {col} already exists in products table.")
            
    conn.commit()
    conn.close()

if __name__ == "__main__":
    update_schema()
