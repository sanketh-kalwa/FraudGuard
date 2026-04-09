import sqlite3
import pandas as pd
from settings import DB_PATH
import os

class DBManager:
    def __init__(self):
        os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
        self.conn = sqlite3.connect(DB_PATH, check_same_thread=False)
        self.create_tables()

    def create_tables(self):
        cursor = self.conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS transactions (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                amount REAL,
                timestamp DATETIME,
                merchant TEXT,
                location TEXT,
                is_fraud INTEGER,
                remarks TEXT
            )
        ''')
        try:
            cursor.execute('ALTER TABLE transactions ADD COLUMN remarks TEXT')
        except:
            pass
        self.conn.commit()

    def insert_transaction(self, tx):
        cursor = self.conn.cursor()
        cursor.execute('''
            INSERT INTO transactions (id, user_id, amount, timestamp, merchant, location, is_fraud, remarks)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (tx['id'], tx['user_id'], tx['amount'], tx['timestamp'], tx['merchant'], tx['location'], tx.get('is_fraud', 0), tx.get('remarks', '')))
        self.conn.commit()

    def get_recent_transactions(self, limit=100):
        return pd.read_sql_query(f"SELECT * FROM transactions ORDER BY timestamp DESC LIMIT {limit}", self.conn)
