import db
import os

print(f"DB Path from db.py: {db.DB_PATH}")
print(f"CWD: {os.getcwd()}")
print(f"Exists? {os.path.exists(db.DB_PATH)}")

# Fix admin
conn = db.get_db_connection()
cursor = conn.cursor()
cursor.execute("UPDATE users SET verified = 1, tfa_enabled = 0, password = 'Password123!' WHERE email = 'admin@example.com'")
conn.commit()
print(f"Updated admin in DB at {db.DB_PATH}")

# Verify
cursor.execute("SELECT * FROM users WHERE email = 'admin@example.com'")
user = cursor.fetchone()
print(f"Admin after update: {dict(user)}")
conn.close()
