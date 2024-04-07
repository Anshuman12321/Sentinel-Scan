from flask import Flask, request, jsonify
import subprocess
import os

app = Flask(__name__)

@app.route('/process-url', methods=['POST'])
def process_url():
    content = request.json
    url = content.get('url')
    if not url:
        return jsonify({'error': 'No URL provided'}), 400

    # Assuming the bash script 'data_collector.sh' is in the same directory
    bash_script_path = os.path.join(os.getcwd(), 'data_collector.sh')

    try:
        subprocess.run(['bash', bash_script_path, url], check=True)
        return jsonify({'message': 'URL processed successfully', 'url': url})
    except subprocess.CalledProcessError as e:
        return jsonify({'error': f'Failed to process URL: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)

