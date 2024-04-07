from flask import Flask, request, jsonify, send_from_directory
import subprocess
from tensorflow.keras.models import load_model

app = Flask(__name__)

model = load_model('/mnt/c/Users/Alexd/PickHacks24/Sentinel-Scan/final_model.h5')

@app.route('/upload-domain-list', methods=['POST'])
def upload_domain_list():
    if 'domain_list' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    file = request.files['domain_list']
    filepath = './temp_domain_list.txt'
    file.save(filepath)
    subprocess.run(['bash', 'path/to/data_collector.sh', filepath])
    return jsonify({'message': 'Script executed'}), 200

@app.route('/predict', methods=['POST'])
def predict():
    def predict():
    data = request.json
    input_data = np.array(data['input']) 
    prediction = model.predict(input_data.reshape(1, -1))
    return jsonify({'prediction': prediction.tolist()}), 200

# Additional route for sentinel.py functionality

if __name__ == '__main__':
    app.run(debug=True)
