import pandas as pd
import numpy as np
import uuid
from datetime import datetime, timedelta

FRAUD_REASONS = [
    'Velocity limit exceeded',
    'Location anomaly detected',
    'Unusual transaction amount',
    'High-risk merchant category',
    'Multiple failed attempts prior',
    'Suspicious IP address'
]

def generate_synthetic_data(n_samples=1000, fraud_rate=0.05, use_seed=False):
    if use_seed:
        np.random.seed(42)
    
    data = []
    now = datetime.now()
    
    merchants = ['Amazon', 'Walmart', 'Target', 'BestBuy', 'Starbucks', 'Uber', 'Netflix']
    locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'London', 'Tokyo']
    
    for i in range(n_samples):
        is_fraud = 1 if np.random.random() < fraud_rate else 0
        
        # Fraudulent transactions tend to be larger and at odd hours
        if is_fraud:
            amount = np.random.exponential(500) + 100
            hour_offset = np.random.randint(0, 5) # Night time
            remarks = np.random.choice(FRAUD_REASONS)
        else:
            amount = np.random.exponential(50) + 5
            hour_offset = np.random.randint(6, 23)
            remarks = ""
            
        tx_time = now - timedelta(days=np.random.randint(0, 30), hours=hour_offset, minutes=np.random.randint(0, 60))
        
        data.append({
            'id': str(uuid.uuid4()),
            'user_id': f"U{np.random.randint(1000, 9999)}",
            'amount': round(amount, 2),
            'timestamp': tx_time.strftime('%Y-%m-%d %H:%M:%S'),
            'merchant': np.random.choice(merchants),
            'location': np.random.choice(locations),
            'is_fraud': is_fraud,
            'remarks': remarks
        })
        
    return pd.DataFrame(data)
