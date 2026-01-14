import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddMemoForm from './AddMemoForm';
import { getAuthHeaders } from './authUtils';
import { API_BASE_URL } from './config';

/**
 * Component that displays a list of memos and handles editing/deleting.
 * @param {string} currentUser - The username of the logged-in user.
 */
function MemoList({ currentUser }) {
  // --- State ---
  const [memos, setMemos] = useState([]);
  
  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  
  // UI Status
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  // --- Handlers ---
  const fetchMemos = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/memos`, {
        headers: getAuthHeaders()
      });
      console.log("Fetched memos:", res.data);
      setMemos(res.data.reverse());
    } catch (err) {
      console.error("Failed to fetch memos:", err);
      setError('メモ取得に失敗しました');
    }
  };

  useEffect(() => {
    fetchMemos();
  }, []);

  const handleDelete = async (id) => {
    try {
      setActionError('');
      await axios.delete(`${API_BASE_URL}/api/memos/${id}`, {
        headers: getAuthHeaders()
      });
      fetchMemos();
    } catch (err) {
      console.error("Failed to delete memo:", err);
      setActionError('削除に失敗しました');
    }
  };

  const startEdit = (memo) => {
    setEditingId(memo.memoid);
    setEditTitle(memo.title);
    setEditBody(memo.body);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditBody('');
  };

  const saveEdit = async () => {
    try {
      setActionError('');
      await axios.put(`${API_BASE_URL}/api/memos/${editingId}`,
        { title: editTitle, body: editBody },
        { headers: getAuthHeaders() }
      );
      cancelEdit();
      fetchMemos();
    } catch (err) {
      console.error("Failed to update memo:", err);
      setActionError('更新に失敗しました');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-800">📋 メモ一覧</h2>

      {/* Error Messages */}
      {error && <p className="text-red-600 text-sm text-center font-semibold">{error}</p>}
      {actionError && <p className="text-red-500 text-sm text-center font-medium">{actionError}</p>}

      {/* Add Form */}
      <AddMemoForm onAdd={fetchMemos} currentUser={currentUser} />

      {/* Memo List */}
      <ul className="space-y-4">
        {memos.map((memo) => (
          <li
            key={memo.memoid}
            className={`bg-white p-4 rounded-lg shadow transition-shadow ${
              editingId === memo.memoid ? 'ring-2 ring-blue-400' : 'hover:shadow-md'
            }`}
          >
            {editingId === memo.memoid ? (
              // Edit Mode
              <div className="space-y-2 animate-fade-in">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="タイトルを入力"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md resize-none"
                  placeholder="内容を入力"
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                />
                <div className="flex gap-2 justify-end">
                  <button
                    className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={saveEdit}
                  >
                    保存
                  </button>
                  <button
                    className="px-4 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    onClick={cancelEdit}
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{memo.title}</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{memo.body}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                    onClick={() => startEdit(memo)}
                  >
                    編集
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleDelete(memo.memoid)}
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