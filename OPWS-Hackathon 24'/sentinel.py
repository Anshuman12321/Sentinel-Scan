import requests
import base64
import subprocess
import pandas as pd
from tensorflow.keras.models import load_model
import numpy as np
import os

# GitHub Configuration with the token hardcoded
GITHUB_TOKEN = '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'
REPO_NAME = 'Sentinel-Scan'
OWNER_NAME = 'Anshuman12321'
FILE_PATH = 'path/to/your/file.txt'
MODEL_PATH = 'final_model.h5'
DATA_COLLECTOR_SCRIPT_PATH = './data_collector.sh'

def fetch_url_from_github():
    """Fetches a URL from a specified file in a GitHub repository."""
    headers = {'Authorization': f'token {GITHUB_TOKEN}'}
    api_url = f"https://api.github.com/repos/{OWNER_NAME}/{REPO_NAME}/contents/{FILE_PATH}"
    response = requests.get(api_url, headers=headers)
    if response.ok:
        content = base64.b64decode(response.json()['content']).decode('utf-8').strip()
        return content
    else:
        print(f"Error fetching URL from GitHub: {response.status_code}")
        return None

def collect_data_with_bash_script(url):
    """Runs a bash script to collect data using the URL fetched from GitHub."""
    try:
        subprocess.run([DATA_COLLECTOR_SCRIPT_PATH, url], check=True)
        print(f"Successfully collected data for: {url}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Failed to collect data: {e}")
        return False

def load_model_and_predict():
    """Loads a pre-trained model and makes a prediction based on collected data."""
    # Load your model
    model = load_model(MODEL_PATH)
    # Assuming your bash script writes output to 'website_data.csv'
    if os.path.exists('website_data.csv'):
        data = pd.read_csv('website_data.csv')
        predictions = model.predict(data)
        # Simplifying for demonstration - adjust based on your model's output
        predicted_class = np.argmax(predictions, axis=1)[0]
        return predicted_class
    else:
        print("website_data.csv not found.")
        return None

def main():
    """Main function to orchestrate the fetching, data collection, and prediction."""
    url = fetch_url_from_github()
    if url and collect_data_with_bash_script(url):
        classification = load_model_and_predict()
        if classification is not None:
            print(f"URL: {url}, Classification: {classification}")
        else:
            print("Failed to make a prediction.")
    else:
        print("Failed to fetch URL or collect data.")

if __name__ == "__main__":
    main()
