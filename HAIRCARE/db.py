import sqlite3
import os
import json

DB_PATH = os.path.join(os.path.dirname(__file__), "haircare.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        totp_secret TEXT,
        verified BOOLEAN DEFAULT 0,
        tfa_enabled BOOLEAN DEFAULT 0,
        role TEXT DEFAULT 'user',
        address TEXT,
        city TEXT,
        zip TEXT,
        country TEXT,
        phone TEXT
    )
    ''')
    
    # Products table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT,
        description TEXT,
        hairType TEXT,
        imageUrl TEXT,
        retailPrice REAL,
        nonPremiumWholesalePrice REAL,
        premiumWholesalePrice REAL,
        discountRate REAL DEFAULT 0,
        appliedNewRetailRate REAL
    )
    ''')
    
    # Orders table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT UNIQUE,
        customer_email TEXT,
        data TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully.")
