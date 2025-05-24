from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required 

from db import get_db

memo_bp = Blueprint('memo', __name__) 

@memo_bp.route('/api/memos', methods=['GET'])
@login_required
def get_memos():
    db = get_db()
    rows = db.execute(
        'SELECT memoid, title, body, created_at '
        'FROM memos '
        'WHERE owner_id = ? '
        'ORDER BY created_at DESC',
        (current_user.get_id(),)
    ).fetchall()
    memos = [dict(r) for r in rows]
    return jsonify(memos), 200

@memo_bp.route('/api/memos', methods=['POST'])
@login_required
def create_memo():
    data  = request.get_json()
    title = data.get('title')
    body  = data.get('body')
    if not title or not body:
        return jsonify({'error': 'title と body が必要です'}), 400 

    db = get_db()
    db.execute(
        'INSERT INTO memos (owner_id, title, body) VALUES (?, ?, ?)',
        (current_user.get_id(), title, body)
    )
    db.commit()
    return jsonify({'message': '作成完了'}), 201

@memo_bp.route('/api/memos/<int:memoid>', methods=['PUT'])
@login_required
def update_memo(memoid):
    data  = request.get_json()
    title = data.get('title')
    body  = data.get('body')
    if not title or not body:
        return jsonify({'error': 'title と body が必要です'}), 400 

    db = get_db()
    res = db.execute(
        'UPDATE memos '
        'SET title = ?, body = ? '
        'WHERE memoid = ? AND owner_id = ?',
        (title, body, memoid, current_user.get_id())
    )
    db.commit()
    if res.rowcount == 0:
        return jsonify({'error': '更新対象が見つからないか権限がありません'}), 404
    return jsonify({'message': '更新完了'}), 200 

@memo_bp.route('/api/memos/<int:memoid>', methods=['DELETE'])
@login_required
def delete_memo(memoid):
    db = get_db()
    res = db.execute(
        'DELETE FROM memos '
        'WHERE memoid = ? AND owner_id = ?',
        (memoid, current_user.get_id())
    )
    db.commit()
    if res.rowcount == 0:
        return jsonify({'error': '削除対象が見つからないか権限がありません'}), 404
    return jsonify({'message': '削除完了'}), 200