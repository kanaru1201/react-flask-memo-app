import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AddMemoForm({ onAdd }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [title,       setTitle]       = useState('');
  const [body,        setBody]        = useState('');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:50000/api/me', { withCredentials: true })
      .then(res => setCurrentUser(res.data.username))
      .catch(() => setCurrentUser(null));
  }, []);

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
        'http://127.0.0.1:50000/api/memos',
        { title, body },
        { withCredentials: true }
      );
      setTitle('');
      setBody('');
      onAdd();
    } catch (err) {
      console.error('登録失敗:', err);
      setError('メモの登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-lg space-y-6 border border-gray-100"
    >
      <h3 className="text-2xl font-extrabold text-gray-800 text-center">
        📝 新規メモ追加
      </h3>

      {currentUser && (
        <p className="text-sm text-gray-600 text-center">
          ログイン中：<span className="font-medium">{currentUser}</span>
        </p>
      )}

      {error && (
        <p className="text-red-600 text-sm text-center">
          {error}
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          タイトル
        </label>
        <input
          type="text"
          placeholder="タイトルを入力"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          内容
        </label>
        <textarea
          placeholder="内容を入力"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full px-4 py-2 h-32 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 text-white font-semibold rounded-lg shadow-md transition-colors duration-200
          ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {loading ? '追加中...' : '＋ 追加'}
      </button>
    </form>
  );
}

export default AddMemoForm;