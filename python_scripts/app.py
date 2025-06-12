import os
import json
import subprocess
from flask import Flask, render_template, request, jsonify

# Import functions from newly created modules
from python_scripts.src.model_trainer import train_or_load_model, predict_next_day_close
from python_scripts.src.data_handler import get_data_file_path

app = Flask(__name__)

# Define paths for model, scaler, and Node.js scripts relative to the project root
# Assuming main_app.py is run from the project root (e.g., E:\Final Project\)
# Adjust these paths if your execution context changes.
MODEL_PATH = 'model/keras_model.h5'
SCALER_PATH = 'model/scaler.joblib'
# DATA_PATH will be handled by data_handler.py directly
NODE_SCRIPTS_DIR = 'node_scripts'

# Ensure node_scripts directory exists
os.makedirs(NODE_SCRIPTS_DIR, exist_ok=True)

# Global variables to hold the loaded model and scalers
# These will be populated once the model is trained/loaded
GLOBAL_MODEL = None
GLOBAL_FEATURE_SCALER = None
GLOBAL_TARGET_SCALER = None

# Hyperparameters for LSTM (kept here for easy access, but also in model_trainer)
LOOK_BACK = 60 # Number of previous days to consider for prediction

@app.before_first_request
def initialize_model_and_scalers():
    """
    Initializes the model and scalers before the first request is served.
    This ensures the model is ready when the app starts.
    """
    global GLOBAL_MODEL, GLOBAL_FEATURE_SCALER, GLOBAL_TARGET_SCALER
    print("Attempting to train or load model...")
    # Pass paths to the model_trainer function
    GLOBAL_MODEL, GLOBAL_FEATURE_SCALER, GLOBAL_TARGET_SCALER = \
        train_or_load_model(MODEL_PATH, SCALER_PATH)
    if GLOBAL_MODEL:
        print("Model and scalers are ready.")
    else:
        print("Failed to load or train model. Check logs for details.")

@app.route('/')
def index():
    """Renders the main page."""
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    """
    Endpoint to trigger Node.js login script.
    """
    try:
        script_path = os.path.join(NODE_SCRIPTS_DIR, 'login.js')
        if not os.path.exists(script_path):
            return jsonify({'status': 'error', 'message': f'Node.js login script not found at {script_path}'}), 500

        # Execute Node.js script
        result = subprocess.run(['node', script_path], capture_output=True, text=True, check=True)
        print(f"Node.js login output:\n{result.stdout}")
        if result.stderr:
            print(f"Node.js login errors:\n{result.stderr}")
        return jsonify({'status': 'success', 'message': result.stdout.strip()})
    except subprocess.CalledProcessError as e:
        return jsonify({'status': 'error', 'message': f'Node.js login script failed: {e.stderr}'}), 500
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Error executing login script: {str(e)}'}), 500

@app.route('/get_historical_data', methods=['POST'])
def get_historical_data():
    """
    Endpoint to trigger Node.js historical data script with a company symbol.
    """
    company_symbol = request.json.get('symbol')
    if not company_symbol:
        return jsonify({'status': 'error', 'message': 'Company symbol is required.'}), 400

    try:
        script_path = os.path.join(NODE_SCRIPTS_DIR, 'get_historical_data.js')
        if not os.path.exists(script_path):
            return jsonify({'status': 'error', 'message': f'Node.js data script not found at {script_path}'}), 500

        # Execute Node.js script with the company symbol as an argument
        # Assuming the Node.js script outputs JSON string to stdout
        result = subprocess.run(['node', script_path, company_symbol], capture_output=True, text=True, check=True)
        print(f"Node.js historical data output:\n{result.stdout}")
        if result.stderr:
            print(f"Node.js historical data errors:\n{result.stderr}")

        # Attempt to parse the output as JSON
        try:
            historical_data = json.loads(result.stdout)
            return jsonify({'status': 'success', 'data': historical_data})
        except json.JSONDecodeError:
            return jsonify({'status': 'error', 'message': 'Failed to parse historical data from Node.js script. Expected JSON.'}), 500

    except subprocess.CalledProcessError as e:
        return jsonify({'status': 'error', 'message': f'Node.js historical data script failed: {e.stderr}'}), 500
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Error executing historical data script: {str(e)}'}), 500

@app.route('/predict', methods=['POST'])
def predict():
    """
    Endpoint to predict the next day's close price using the loaded model.
    Expects 'historical_data' as a list of dicts from the frontend.
    """
    if GLOBAL_MODEL is None or GLOBAL_FEATURE_SCALER is None or GLOBAL_TARGET_SCALER is None:
        return jsonify({'status': 'error', 'message': 'Model or scaler not loaded/trained. Please restart the server or ensure model initialization.'}), 500

    historical_data_raw = request.json.get('historical_data')
    if not historical_data_raw or not isinstance(historical_data_raw, list) or len(historical_data_raw) < LOOK_BACK:
        return jsonify({'status': 'error', 'message': f'Insufficient historical data provided for prediction. Need at least {LOOK_BACK} days.'}), 400

    try:
        predicted_close_price, last_actual_close, error_percentage = \
            predict_next_day_close(historical_data_raw, GLOBAL_MODEL, GLOBAL_FEATURE_SCALER, GLOBAL_TARGET_SCALER, LOOK_BACK)

        return jsonify({
            'status': 'success',
            'predicted_close_price': round(predicted_close_price, 2),
            'last_actual_close': round(last_actual_close, 2),
            'prediction_error_percentage': round(error_percentage, 2)
        })

    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Error during prediction: {str(e)}'}), 500

if __name__ == '__main__':
    # Flask development server runs with debug=True, which can sometimes cause
    # before_first_request to run twice. For production, you might use a WSGI server.
    app.run(debug=True, port=5000)

