from flask import Flask, jsonify 
from flask_cors import CORS 
from flask_login import LoginManager 

import os

from config import Config
from db import get_db
from models.user import User
from routes.auth import auth_bp
from routes.memo import memo_bp

app = Flask(__name__)
# config.pyのConfigクラスで定義されている設定値（Flask公式＋自作）をapp.configに読み込む
app.config.from_object(Config)
CORS(app, supports_credentials=True)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'OK'}), 200

login_manager = LoginManager()
login_manager.init_app(app) 

# 1, @login_requiredデコレータが使われているルートにHTTPリクエストが来たとき，Flask-Loginはセッションから_user_idを取り出し，それを引数として@login_manager.user_loaderで登録された関数を呼び出す．
# 2, その戻り値（ユーザーオブジェクト）がcurrent_userにセットされ，@login_requiredはそのcurrent_user.is_authenticatedを判定する．
@login_manager.user_loader
def load_user(_user_id): 
    db = get_db()
    row = db.execute(
        'SELECT userid, username, password FROM users WHERE userid = ?',
        (_user_id,)
    ).fetchone() 
    if row is None:
        return None
    return User(row['userid'], row['username'], row['password'])

app.register_blueprint(auth_bp)
app.register_blueprint(memo_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=50000)