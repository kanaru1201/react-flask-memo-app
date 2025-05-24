import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddMemoForm from './AddMemoForm';

function MemoList() {
  const [memos, setMemos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchMemos = () => {
    axios.get('http://127.0.0.1:50000/api/memos', { withCredentials: true })
      .then(res => {
        console.log("取得したメモ一覧:", res.data);
        setMemos(res.data.reverse());
      })
      .catch(err => {
        console.error('取得失敗:', err);
        setError('メモ取得に失敗しました');
      });
  };

  useEffect(fetchMemos, []);

  const handleDelete = async (id) => {
    try {
      setActionError('');
      await axios.delete(`http://127.0.0.1:50000/api/memos/${id}`, {
        withCredentials: true
      });
      fetchMemos();
    } catch (err) {
      console.error('削除失敗:', err);
      setActionError('削除に失敗しました');
    }
  };

  const startEdit = (memos) => {
    setEditingId(memos.memoid);
    setEditTitle(memos.title);
    setEditBody(memos.body);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditBody('');
  };

  const saveEdit = async () => {
    try {
      setActionError('');
      await axios.put(`http://127.0.0.1:50000/api/memos/${editingId}`,
        { title: editTitle, body: editBody },
        { withCredentials: true }
      );
      cancelEdit();
      fetchMemos();
    } catch (err) {
      console.error('更新失敗:', err);
      setActionError('更新に失敗しました');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">📋 メモ一覧</h2>

      {error && <p className="text-red-600 text-sm text-center font-semibold">{error}</p>}
      {actionError && <p className="text-red-500 text-sm text-center font-medium">{actionError}</p>}

      <AddMemoForm onAdd={fetchMemos} />

      <ul className="space-y-4">
        {memos.map((memos) => (
          <li
            key={memos.memoid}
            className={`bg-white p-4 rounded-lg shadow transition-shadow ${
              editingId === memos.memoid ? 'ring-2 ring-blue-400' : 'hover:shadow-md'
            }`}
          >
            {editingId === memos.memoid ? (
              <div className="space-y-2 animate-fade-in">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="タイトルを入力"
                />
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md resize-none"
                  placeholder="内容を入力"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={saveEdit}
                    className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    保存
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{memos.title}</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{memos.body}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(memos)}
                    className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(memos.memoid)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    削除
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MemoList;