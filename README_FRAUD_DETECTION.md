# Project Architecture

This project implements a Real-Time Fraud Detection System using Machine Learning over DBMS Data.

## Tech Stack
- **Frontend:** Streamlit
- **Machine Learning:** XGBoost
- **Database:** SQLite (PostgreSQL compatible)
- **Streaming:** Kafka (Simulated)
- **Feature Store:** Redis (Simulated)
- **Data Processing:** Pandas, NumPy
- **Visualization:** Plotly

## File Structure
- `streamlit_app.py`: Main dashboard application
- `config/settings.py`: Configuration variables
- `database/db_manager.py`: SQLite database operations
- `models/fraud_detector.py`: XGBoost model wrapper
- `models/feature_engineering.py`: Feature engineering logic
- `utils/data_generator.py`: Synthetic transaction generator
- `test_system.py`: Automated tests
