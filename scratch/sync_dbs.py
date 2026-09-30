import sqlite3
import os

for db_path in ['skilltrackai.db', 'backend/skilltrackai.db']:
    if os.path.exists(db_path):
        conn = sqlite3.connect(db_path)
        cur = conn.cursor()
        def add_col_if_missing(table, col, col_type, default_val=None):
            cur.execute(f"PRAGMA table_info({table})")
            cols = [r[1] for r in cur.fetchall()]
            if col not in cols:
                print(f"Adding {col} to {table} in {db_path}...")
                d_clause = f" DEFAULT {default_val}" if default_val is not None else ""
                cur.execute(f"ALTER TABLE {table} ADD COLUMN {col} {col_type}{d_clause}")
        
        # Trainees
        add_col_if_missing('trainees', 'skill_id', 'VARCHAR(64)')
        add_col_if_missing('trainees', 'date_of_birth', 'VARCHAR(20)')
        add_col_if_missing('trainees', 'address', 'VARCHAR(255)')
        add_col_if_missing('trainees', 'state', 'VARCHAR(60)', "'Maharashtra'")
        add_col_if_missing('trainees', 'city', 'VARCHAR(60)')
        add_col_if_missing('trainees', 'pincode', 'VARCHAR(10)')
        add_col_if_missing('trainees', 'profile_photo_url', 'VARCHAR(255)')
        add_col_if_missing('trainees', 'bio', 'TEXT')
        add_col_if_missing('trainees', 'target_role', 'VARCHAR(100)')

        # Users
        add_col_if_missing('users', 'failed_login_attempts', 'INTEGER', 0)
        add_col_if_missing('users', 'is_locked', 'BOOLEAN', 0)
        add_col_if_missing('users', 'lockout_until', 'DATETIME')
        add_col_if_missing('users', 'last_login_at', 'DATETIME')

        conn.commit()
        conn.close()

print("[OK] Synchronized all columns in both sqlite databases!")
