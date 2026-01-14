import React, { useState } from 'react';
import axios from 'axios';
import { getAuthHeaders } from './authUtils';
import { API_BASE_URL } from './config';

/**
 * Component for adding a new memo.
 * @param {Function} onAdd - Callback executed after a memo is successfully added.
 * @param {string} currentUser - The username of the logged-in user.
 */
function AddMemoForm({ onAdd, currentUser }) {
  // --- State ---
  // Input Values
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  
  // UI Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- Handlers ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !body) {
      setError('タイトルと内容を両方入力してください');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/memos`,
        { title, body },
        { headers: getAuthHeaders() }
      );
      // Reset form
      setTitle('');
      setBody('');
      onAdd();
    } catch (err) {
      console.error('Failed to save memo:', err);
      setError('メモの登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-lg space-y-6 border border-gray-100"
      onSubmit={handleSubmit}
    >
      <h3 className="text-2xl font-extrabold text-gray-800 text-center">
        📝 新規メモ追加
      </h3>

      {/* User Info */}
      {currentUser && (
        <p className="text-sm text-gray-600 text-center">
          ログイン中：<span className="font-medium">{currentUser}</span>
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-red-600 text-sm text-center">
          {error}
        </p>
      )}

      {/* Title Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          タイトル
        </label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="タイトルを入力"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Body Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          内容
        </label>
        <textarea
          className="w-full px-4 py-2 h-32 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="内容を入力"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full py-2 text-white font-semibold rounded-lg shadow-md transition-colors duration-200
          ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        disabled={loading}
      >
        {loading ? '追加中...' : '＋ 追加'}
      </button>
    </form>
  );
}

export default AddMemoForm;