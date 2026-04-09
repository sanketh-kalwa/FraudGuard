# 🚀 Real-Time Fraud Detection System

Welcome to your complete Fraud Detection System built with Python, Streamlit, and XGBoost!

## 📋 Prerequisites
- Python 3.9 or higher
- Visual Studio Code (recommended)

## 🛠️ Installation & Setup

### Method 1: Visual Studio Code (Recommended)
1. Open this folder (`python_project`) in Visual Studio Code.
2. Open a new Terminal (`Ctrl + ~`).
3. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Run the application:
   ```bash
   streamlit run streamlit_app.py
   ```

### Method 2: Windows Quick Start
Simply double-click the `RUN_APP.bat` file.

## 🎯 First Time Usage
1. Open the app in your browser (usually `http://localhost:8501`).
2. Go to the **⚙️ Settings** page and click "Generate Data" to create synthetic transactions.
3. Go to the **🎯 Model Training** page and click "Train Model" to train the XGBoost classifier.
4. Go to the **🔄 Real-Time Monitor** page to watch the live fraud detection stream!

## 🧪 Running Tests
To verify all components are working correctly, run:
```bash
python test_system.py
```
