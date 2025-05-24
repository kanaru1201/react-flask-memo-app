from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user, logout_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash

from db import get_db
from models.user import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'username と password は必須です'}), 400 

    db = get_db()
    existing = db.execute(
        'SELECT 1 FROM users WHERE username = ?', (username,)
    ).fetchone()
    if existing:
        return jsonify({'error': 'このユーザー名は既に使われています'}), 409 

    hashed = generate_password_hash(password, method='pbkdf2:sha256')
    db.execute(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        (username, hashed)
    )
    db.commit()

    return jsonify({'message': '登録成功'}), 201 

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:  
        return jsonify({'error': 'username と password は必須です'}), 400 

    db = get_db()
    row = db.execute(
        'SELECT userid, username, password FROM users WHERE username = ?',
        (username,)
    ).fetchone()

    if row and check_password_hash(row['password'], password):
        user = User(row['userid'], row['username'], row['password'])
        # ↓login_user(user)の処理の流れ
        # 1, login_user(user)を呼ぶと，Flask-Loginはuser.get_id()の戻り値をsession['_user_id']に保存する．
        # 2, Flaskはセッション情報を署名付きのクッキーとしてブラウザに送信し，以降のリクエストではそのクッキーが自動的に送信される．
        # 3, リクエストのたびにFlask-Loginはセッションから_user_idを取り出し，@login_manager.user_loaderで登録された関数を使ってユーザーを復元し，current_userにセットする．
        login_user(user) 
        return jsonify({'message': 'ログイン成功'}), 200

    return jsonify({'error': 'ログイン失敗'}), 401

@auth_bp.route('/api/me', methods=['GET'])
@login_required
def get_current_user():
    return jsonify({
        'userid':  current_user.get_id(), 
        'username': current_user.username 
    }), 200

@auth_bp.route('/api/logout', methods=['POST'])
def logout():
    # ↓logout_user()の処理の流れ
    # 1, logout_user()を呼ぶと，Flask-Loginはsession['_user_id']を削除してセッション上のログイン情報を消去する．
    # 2, 次のリクエストでは_user_idが存在しないため，Flask-Loginはcurrent_userにAnonymousUserMixinをセットする．
    # 3, その結果，current_user.is_authenticatedはFalseとなり，@login_requiredの判定により保護されたルートにはアクセスできなくなる．
    logout_user() 
    return jsonify({'message': 'ログアウトしました'}), 200