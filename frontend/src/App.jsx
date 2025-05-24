import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from 'react-router-dom';
import axios from 'axios';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import MemoList from './MemoList';

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://127.0.0.1:50000/api/me', { withCredentials: true })
      .then(() => {
        setLoggedIn(true);
        setLoading(false);
      })
      .catch(() => {
        setLoggedIn(false);
        setLoading(false);
      });
  }, []);

  const handleLoginSuccess = () => {
    setLoggedIn(true);
    navigate('/memos');
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://127.0.0.1:50000/api/logout', {}, { withCredentials: true });
      setLoggedIn(false);
      navigate('/login');
    } catch (err) {
      console.error('ログアウト失敗:', err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      {loggedIn && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded shadow"
          >
            ログアウト
          </button>
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={<Navigate to={loggedIn ? '/memos' : '/login'} replace />}
        />
        <Route
          path="/login"
          element={
            loggedIn ? (
              <Navigate to="/memos" replace />
            ) : (
              <LoginForm onSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/register"
          element={
            loggedIn ? (
              <Navigate to="/memos" replace />
            ) : (
              <RegisterForm />
            )
          }
        />
        <Route
          path="/memos"
          element={
            loggedIn ? (
              <MemoList />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        {/* 404対策 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default AppWrapper;