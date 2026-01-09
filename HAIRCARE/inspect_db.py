import sqlite3
import os

DB_PATH = "haircare.db"

def check_db():
    if not os.path.exists(DB_PATH):
        print("Database not found.")
        return
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    print("--- Users ---")
    cursor.execute("SELECT email, role, verified, tfa_enabled FROM users")
    for row in cursor.fetchall():
        print(dict(row))
        
    print("\n--- Products (First 3) ---")
    cursor.execute("SELECT name, imageUrl FROM products LIMIT 3")
    for row in cursor.fetchall():
        print(dict(row))
    
    conn.close()

if __name__ == "__main__":
    check_db()
