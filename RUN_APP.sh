#!/bin/bash
echo "Installing requirements..."
pip install -r requirements.txt
echo "Starting Streamlit App..."
streamlit run streamlit_app.py
