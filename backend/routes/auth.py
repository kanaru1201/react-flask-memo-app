# Third-party imports
from flask import Blueprint, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash

# Local application imports
from db import get_db
from jwt_utils import generate_token, token_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                'SELECT 1 FROM users WHERE username = %s', (username,)
            )
            existing = cur.fetchone()
            if existing:
                return jsonify({'error': 'Username is already taken'}), 409

            hashed = generate_password_hash(password, method='pbkdf2:sha256')
            cur.execute(
                'INSERT INTO users (username, password) VALUES (%s, %s)',
                (username, hashed)
            )
            conn.commit()
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                'SELECT userid, username, password FROM users WHERE username = %s',
                (username,)
            )
            row = cur.fetchone()

        if row and check_password_hash(row['password'], password):
            token = generate_token(row['userid'])
            return jsonify({
                'message': 'Login successful',
                'token': token,
                'userid': row['userid'],
                'username': row['username']
            }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

    return jsonify({'error': 'Invalid username or password'}), 401

@auth_bp.route('/api/me', methods=['GET'])
@token_required
def get_current_user():
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                'SELECT userid, username FROM users WHERE userid = %s',
                (request.userid,)
            )
            row = cur.fetchone()

        if row:
            return jsonify({
                'userid': row['userid'],
                'username': row['username']
            }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

    return jsonify({'error': 'User not found'}), 404

@auth_bp.route('/api/logout', methods=['POST'])
def logout():
    return jsonify({'message': 'Logged out successfully'}), 200