import pandas as pd
import numpy as np

class FeatureEngineer:
    def __init__(self):
        pass
        
    def create_features(self, df):
        if df.empty:
            return df
        
        df = df.copy()
        # Convert timestamp
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        
        # Time based features
        df['hour'] = df['timestamp'].dt.hour
        df['day_of_week'] = df['timestamp'].dt.dayofweek
        
        # Amount based features
        df['amount_log'] = np.log1p(df['amount'])
        
        # Simulated historical features (in a real app, these come from Redis)
        df['user_daily_tx_count'] = np.random.randint(1, 10, size=len(df))
        df['user_daily_tx_amount'] = df['amount'] * df['user_daily_tx_count']
        
        # Merchant features
        df['merchant_risk_score'] = np.random.uniform(0, 1, size=len(df))
        
        # Fill missing
        df = df.fillna(0)
        
        return df
        
    def get_feature_columns(self):
        return ['amount', 'hour', 'day_of_week', 'amount_log', 
                'user_daily_tx_count', 'user_daily_tx_amount', 'merchant_risk_score']
