import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from './config';

/**
 * Component for registering a new user.
 */
function RegisterForm() {
  // --- State ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  
  // UI Status
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // --- Handlers ---
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validation
    if (!username || !password || !confirm) {
      setError('すべての項目を入力してください');
      return;
    }

    if (password !== confirm) {
      setError('パスワードが一致しません');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/signup`, {
        username,
        password
      });

      if (res.status === 201) {
        setMessage('🎉 登録成功！ログイン画面に移動します...');
        setUsername('');
        setPassword('');
        setConfirm('');

        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response && err.response.status === 409) {
        setError('⚠️ ユーザーIDは既に存在します');
      } else {
        setError('登録に失敗しました');
      }
      setLoading(false);
    }
  };

  return (
    <form
      className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg space-y-6"
      onSubmit={handleRegister}
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">🆕 新規ユーザー登録</h2>

      {/* Messages */}
      {error && <p className="text-red-600 text-sm font-medium text-center">{error}</p>}
      {message && <p className="text-green-600 text-sm font-medium text-center">{message}</p>}

      {/* Username Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          ユーザーID
        </label>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="例: taro123"
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
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {/* Password Confirm Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          パスワード確認
        </label>
        <input
          type="password"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full py-2 text-white font-semibold rounded-md shadow transition-colors ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
        disabled={loading}
      >
        {loading ? '登録中...' : '登録'}
      </button>

      {/* Link to Login */}
      <p className="text-sm text-center text-gray-600">
        すでにアカウントをお持ちですか？{' '}
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          ログイン
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;