from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze():
    if not request.json or 'website_url' not in request.json:
        return jsonify({'error': 'Missing website_url'}), 400

    website_url = request.json[window.location.href]
  
    # Construct and send the response
    response_data = {
        'status': 'success',
        'website_url': website_url,
        'headers': headers_data,
        'vulnerabilities': vulnerabilities_data
    }
    
    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True)
