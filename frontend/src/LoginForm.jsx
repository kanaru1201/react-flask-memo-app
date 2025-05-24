import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function LoginForm({ onSuccess }) {
  const [username, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:50000/api/login',
        { username, password },
        { withCredentials: true }
      );
      console.log('ログイン成功');
      onSuccess();
    } catch (err) {
      console.error(err);
      setError('ログイン失敗！IDかパスワードが間違ってる');
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">🔐 ログイン</h2>

      {error && <p className="text-red-600 text-sm text-center">{error}</p>}

      <div>
        <label className="block text-sm font-semibold text-gray-700">ユーザーID</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUserid(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700">パスワード</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
      >
        ログイン
      </button>

      <p className="text-sm text-center">
        アカウントがまだない？{' '}
        <Link to="/register" className="text-blue-600 hover:underline font-semibold">
          新規登録
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;