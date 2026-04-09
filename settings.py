import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, 'database', 'transactions.db')
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'xgboost_fraud_model.json')

KAFKA_TOPIC = 'transactions'
KAFKA_SERVER = 'localhost:9092'
REDIS_HOST = 'localhost'
REDIS_PORT = 6379
