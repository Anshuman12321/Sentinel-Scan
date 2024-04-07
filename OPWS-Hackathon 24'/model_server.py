from flask import Flask, request, jsonify
from flask_cors import CORS
from keras.models import load_model
# Assuming you have a function to preprocess the URL
# from preprocess import preprocess_url

app = Flask(__name__)
CORS(app)

# Load your neural network model
model = load_model('final_model.h5')

@app.route('/classify-url', methods=['POST'])
def classify_url():
    data = request.json
    url = data['url']
    # Preprocess the URL as required by your model
    # processed_url = preprocess_url(url)
    # prediction = model.predict(processed_url)
    prediction = "Safe"  # Placeholder for demonstration
    return jsonify({"classification": prediction})

if __name__ == '__main__':
    app.run(port=5000, debug=True)