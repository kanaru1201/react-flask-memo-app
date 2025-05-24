import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const [username, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!username || !password || !confirm) {
      setError('すべての項目を入力してください');
      return;
    }

    if (password !== confirm) {
      setError('パスワードが一致しません');
      return;
    }

    try {
      const res = await axios.post(
        'http://127.0.0.1:50000/api/signup',
        { username, password },
        { withCredentials: true }
      );

      if (res.status === 201) {
        setMessage('🎉 登録成功！ログイン画面に移動します...');
        setUserid('');
        setPassword('');
        setConfirm('');

        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 409) {
        setError('⚠️ ユーザーIDは既に存在します');
      } else {
        setError('登録に失敗しました');
      }
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg space-y-5"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">🆕 新規ユーザー登録</h2>

      {error && <p className="text-red-600 text-sm font-medium text-center">{error}</p>}
      {message && <p className="text-green-600 text-sm font-medium text-center">{message}</p>}

      <div>
        <label className="block text-sm font-semibold text-gray-700">ユーザーID</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUserid(e.target.value)}
          placeholder="例: taro123"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">パスワード</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">パスワード確認</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow"
      >
        登録
      </button>

      <p className="text-sm text-center">
        すでにアカウントをお持ちですか？{' '}
        <a href="/login" className="text-blue-600 hover:underline font-medium">
          ログイン
        </a>
      </p>
    </form>
  );
}

export default RegisterForm;