import unittest
import pandas as pd
from utils.data_generator import generate_synthetic_data
from models.feature_engineering import FeatureEngineer
from models.fraud_detector import FraudDetector

class TestFraudSystem(unittest.TestCase):
    def setUp(self):
        self.df = generate_synthetic_data(100)
        self.fe = FeatureEngineer()
        self.model = FraudDetector()

    def test_data_generation(self):
        self.assertEqual(len(self.df), 100)
        self.assertTrue('is_fraud' in self.df.columns)

    def test_feature_engineering(self):
        features = self.fe.create_features(self.df)
        self.assertTrue('hour' in features.columns)
        self.assertTrue('amount_log' in features.columns)

    def test_model_training(self):
        acc = self.model.train(self.df)
        self.assertGreater(acc, 0.0)
        self.assertTrue(self.model.is_trained)

    def test_model_prediction(self):
        self.model.train(self.df)
        preds = self.model.predict(self.df)
        self.assertEqual(len(preds), 100)

if __name__ == '__main__':
    unittest.main()
