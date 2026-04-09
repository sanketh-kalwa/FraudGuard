import xgboost as xgb
import pandas as pd
import numpy as np
import os
from settings import MODEL_PATH
from feature_engineering import FeatureEngineer

class FraudDetector:
    def __init__(self):
        self.model = xgb.XGBClassifier(
            n_estimators=100,
            max_depth=5,
            learning_rate=0.1,
            eval_metric='logloss'
        )
        self.fe = FeatureEngineer()
        self.is_trained = False
        
        if os.path.exists(MODEL_PATH):
            try:
                self.model.load_model(MODEL_PATH)
                self.is_trained = True
            except:
                pass

    def train(self, df):
        features = self.fe.create_features(df)
        X = features[self.fe.get_feature_columns()]
        y = df['is_fraud']
        
        self.model.fit(X, y)
        self.is_trained = True
        
        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        self.model.save_model(MODEL_PATH)
        
        # Return accuracy
        preds = self.model.predict(X)
        accuracy = (preds == y).mean()
        return accuracy

    def predict(self, df):
        if not self.is_trained:
            return np.random.uniform(0, 1, size=len(df)) # Fallback
            
        features = self.fe.create_features(df)
        X = features[self.fe.get_feature_columns()]
        
        # Return probability of fraud
        return self.model.predict_proba(X)[:, 1]
