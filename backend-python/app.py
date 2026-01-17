from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from routes.auth import auth_bp
from routes.memo import memo_bp

app = Flask(__name__)
app.config.from_object(Config)

CORS(app,
     origins=app.config['CORS_ORIGINS'],
     supports_credentials=True,
     allow_headers=['Content-Type', 'Authorization'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'OK'}), 200

app.register_blueprint(auth_bp)
app.register_blueprint(memo_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)