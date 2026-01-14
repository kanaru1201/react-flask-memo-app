import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { setToken } from './authUtils';
import { API_BASE_URL } from './config';

/**
 * Component for user login.
 * @param {Function} onSuccess - Callback executed after a successful login.
 */
function LoginForm({ onSuccess }) {
  // --- State ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Handlers ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, {
        username,
        password
      });

      setToken(response.data.token);
      console.log('Login successful');
      onSuccess();
    } catch (err) {
      console.error('Login error:', err);
      setError('ログインに失敗しました。ユーザーIDかパスワードが違います。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg space-y-6"
      onSubmit={handleLogin}
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">🔐 ログイン</h2>

      {/* Error Message */}
      {error && (
        <p className="text-red-600 text-sm text-center font-medium">
          {error}
        </p>
      )}

      {/* Username Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          ユーザーID
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      {/* Password Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          パスワード
        </label>
        <input
          type="password"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full py-2 text-white font-semibold rounded-md transition-colors ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
        disabled={loading}
      >
        {loading ? 'ログイン中...' : 'ログイン'}
      </button>

      {/* Register Link */}
      <p className="text-sm text-center text-gray-600">
        アカウントをお持ちでないですか？{' '}
        <Link to="/register" className="text-blue-600 hover:underline font-semibold">
          新規登録
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
