# Third Party Library
from flask import Blueprint, jsonify, request

# Local application imports
from db import get_db
from jwt_utils import token_required

memo_bp = Blueprint('memo', __name__) 

@memo_bp.route('/api/memos', methods=['GET'])
@token_required
def get_memos():
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                'SELECT memoid, title, body, created_at '
                'FROM memos '
                'WHERE owner_id = %s '
                'ORDER BY created_at DESC',
                (request.userid,)
            )
            rows = cur.fetchall()
        memos = [dict(r) for r in rows]
        return jsonify(memos), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@memo_bp.route('/api/memos', methods=['POST'])
@token_required
def create_memo():
    data  = request.get_json()
    title = data.get('title')
    body  = data.get('body')
    if not title or not body:
        return jsonify({'error': 'Title and body are required'}), 400

    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                'INSERT INTO memos (owner_id, title, body) VALUES (%s, %s, %s)',
                (request.userid, title, body)
            )
            conn.commit()
        return jsonify({'message': 'Memo created successfully'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@memo_bp.route('/api/memos/<int:memoid>', methods=['PUT'])
@token_required
def update_memo(memoid):
    data  = request.get_json()
    title = data.get('title')
    body  = data.get('body')
    if not title or not body:
        return jsonify({'error': 'Title and body are required'}), 400

    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                'UPDATE memos '
                'SET title = %s, body = %s '
                'WHERE memoid = %s AND owner_id = %s',
                (title, body, memoid, request.userid)
            )
            conn.commit()
            if cur.rowcount == 0:
                return jsonify({'error': 'Memo not found or unauthorized'}), 404
        return jsonify({'message': 'Memo updated successfully'}), 200 
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()

@memo_bp.route('/api/memos/<int:memoid>', methods=['DELETE'])
@token_required
def delete_memo(memoid):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                'DELETE FROM memos '
                'WHERE memoid = %s AND owner_id = %s',
                (memoid, request.userid)
            )
            conn.commit()
            if cur.rowcount == 0:
                return jsonify({'error': 'Memo not found or unauthorized'}), 404
        return jsonify({'message': 'Memo deleted successfully'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()