import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
import time
from datetime import datetime

from db_manager import DBManager
from fraud_detector import FraudDetector
from data_generator import generate_synthetic_data

st.set_page_config(page_title="Fraud Detection System", page_icon="🛡️", layout="wide")

# Initialize components
@st.cache_resource
def get_db():
    db = DBManager()
    # Auto-generate initial data if empty (since Settings is removed)
    if len(db.get_recent_transactions(1)) == 0:
        df = generate_synthetic_data(2000, 0.05, use_seed=True)
        for _, row in df.iterrows():
            db.insert_transaction(row.to_dict())
    return db

@st.cache_resource
def get_model():
    return FraudDetector()

db = get_db()
model = get_model()

# Sidebar navigation
st.sidebar.title("🛡️ Fraud Detection")
page = st.sidebar.radio("Navigation", 
    ["📈 Dashboard", "🔄 Real-Time Monitor", "🚨 Fraud Detected", "🎯 Model Training", "📊 Analytics"]
)

if page == "📈 Dashboard":
    st.title("System Dashboard")
    
    df = db.get_recent_transactions(1000)
    if df.empty:
        st.warning("No data available. Please generate data in Settings.")
    else:
        col1, col2, col3, col4 = st.columns(4)
        col1.metric("Total Transactions", len(df))
        col2.metric("Fraud Rate", f"{(df['is_fraud'].mean() * 100):.2f}%")
        col3.metric("Total Volume", f"${df['amount'].sum():,.2f}")
        col4.metric("Avg Transaction", f"${df['amount'].mean():,.2f}")
        
        st.subheader("Recent Transactions")
        st.dataframe(df.head(10), use_container_width=True)
        
        col1, col2 = st.columns(2)
        with col1:
            fig = px.pie(df, names='is_fraud', title='Fraud Distribution', color='is_fraud', 
                         color_discrete_map={0: 'green', 1: 'red'})
            st.plotly_chart(fig, use_container_width=True)
            
        with col2:
            fig = px.histogram(df, x='amount', color='is_fraud', title='Transaction Amount Distribution',
                               barmode='overlay', color_discrete_map={0: 'green', 1: 'red'})
            st.plotly_chart(fig, use_container_width=True)

elif page == "🔄 Real-Time Monitor":
    st.title("Real-Time Transaction Monitor")
    
    if not model.is_trained:
        st.warning("Model is not trained! Please train the model first.")
    
    start_stream = st.button("Start Live Stream")
    stop_stream = st.button("Stop Stream")
    
    placeholder = st.empty()
    
    if start_stream:
        st.session_state.streaming = True
        
    if stop_stream:
        st.session_state.streaming = False
        
    if st.session_state.get('streaming', False):
        with placeholder.container():
            st.subheader("Live Feed")
            metrics_col1, metrics_col2, metrics_col3 = st.columns(3)
            m1 = metrics_col1.empty()
            m2 = metrics_col2.empty()
            m3 = metrics_col3.empty()
            
            tx_table = st.empty()
            
            recent_txs = []
            
            for i in range(100):
                if not st.session_state.get('streaming', False):
                    break
                    
                # Generate 1 transaction
                new_tx = generate_synthetic_data(1).iloc[0].to_dict()
                
                # Predict
                df_tx = pd.DataFrame([new_tx])
                fraud_prob = model.predict(df_tx)[0]
                
                new_tx['fraud_probability'] = fraud_prob
                new_tx['alert'] = '🔴 FRAUD' if fraud_prob > 0.5 else '🟢 SAFE'
                
                # Save to DB
                db.insert_transaction(new_tx)
                
                recent_txs.insert(0, new_tx)
                if len(recent_txs) > 15:
                    recent_txs.pop()
                    
                df_display = pd.DataFrame(recent_txs)
                
                m1.metric("Transactions Processed", i+1)
                m2.metric("Latest Score", f"{fraud_prob:.2%}")
                m3.metric("Status", new_tx['alert'])
                
                def highlight_fraud(row):
                    if row['fraud_probability'] > 0.5:
                        return ['background-color: rgba(255, 0, 0, 0.2)'] * len(row)
                    return [''] * len(row)
                
                tx_table.dataframe(df_display[['id', 'amount', 'merchant', 'fraud_probability', 'alert', 'remarks']].style.apply(highlight_fraud, axis=1), use_container_width=True)
                
                time.sleep(1)

elif page == "🚨 Fraud Detected":
    st.title("🚨 Fraud Detected Log")
    st.markdown("Log of all blocked transactions and their trigger reasons.")
    
    df = db.get_recent_transactions(5000)
    if df.empty:
        st.warning("No data available.")
    else:
        fraud_df = df[df['is_fraud'] == 1].copy()
        if fraud_df.empty:
            st.success("No fraudulent transactions detected yet.")
        else:
            st.metric("Total Fraudulent Transactions", len(fraud_df))
            
            # Display the fraud table
            st.dataframe(
                fraud_df[['timestamp', 'id', 'merchant', 'amount', 'remarks']].style.set_properties(**{'background-color': 'rgba(255, 0, 0, 0.1)', 'color': '#900'}),
                use_container_width=True
            )

elif page == "🎯 Model Training":
    st.title("XGBoost Model Training")
    
    df = db.get_recent_transactions(5000)
    
    if df.empty:
        st.warning("Not enough data to train. Generate data in Settings.")
    else:
        st.write(f"Available training samples: {len(df)}")
        
        if st.button("Train Model"):
            with st.spinner("Training XGBoost model..."):
                accuracy = model.train(df)
                time.sleep(1) # Simulate processing
                st.success(f"Model trained successfully! Accuracy: {accuracy:.2%}")
                
        if model.is_trained:
            st.info("Model is currently trained and ready for predictions.")
            
            # Feature Importance (Mocked for demo)
            st.subheader("Feature Importance")
            features = model.fe.get_feature_columns()
            importance = np.random.uniform(0, 1, size=len(features))
            importance = importance / importance.sum()
            
            fig = px.bar(x=importance, y=features, orientation='h', title="XGBoost Feature Importance")
            st.plotly_chart(fig)

elif page == "📊 Analytics":
    st.title("Advanced Analytics")
    
    df = db.get_recent_transactions(2000)
    if df.empty:
        st.warning("No data available.")
    else:
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df['hour'] = df['timestamp'].dt.hour
        
        col1, col2 = st.columns(2)
        
        with col1:
            hourly_fraud = df[df['is_fraud']==1].groupby('hour').size().reset_index(name='count')
            fig = px.line(hourly_fraud, x='hour', y='count', title='Fraudulent Transactions by Hour')
            st.plotly_chart(fig, use_container_width=True)
            
        with col2:
            merchant_fraud = df[df['is_fraud']==1].groupby('merchant').size().reset_index(name='count')
            fig = px.bar(merchant_fraud, x='merchant', y='count', title='Fraud by Merchant')
            st.plotly_chart(fig, use_container_width=True)
