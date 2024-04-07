from flask import Flask, request, jsonify
from flask_cors import CORS
from keras.models import load_model

app = Flask(__name__)
CORS(app)

model = load_model('final_model.h5')

@app.route('/classify-url', methods=['POST'])
def classify_url():
    data = request.json
    url = data['url']
    # processed_url = preprocess_url(url)
    # prediction = model.predict(processed_url)
    prediction = "Safe"  # Placeholder for demonstration
    return jsonify({"classification": prediction})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
