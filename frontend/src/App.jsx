import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import MemoList from './MemoList';
import { getToken, removeToken, getAuthHeaders } from './authUtils';
import { API_BASE_URL } from './config';

/**
 * Root component that provides the Router context.
 */
function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

/**
 * Main application component.
 * Handles authentication status and routing.
 */
function App() {
  // --- State ---
  const [loggedIn, setLoggedIn] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // --- Effects ---
  // Check login status on initial load
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoggedIn(false);
      setLoading(false);
      return;
    }

    axios
      .get(`${API_BASE_URL}/api/me`, { headers: getAuthHeaders() })
      .then((res) => {
        setLoggedIn(true);
        setCurrentUser(res.data.username);
      })
      .catch(() => {
        removeToken();
        setLoggedIn(false);
        setCurrentUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // --- Handlers ---
  const handleLoginSuccess = () => {
    setLoggedIn(true);
    navigate('/memos');
    // Refresh the page to reset state completely
    window.location.reload(); 
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/logout`, {}, { headers: getAuthHeaders() });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      removeToken();
      setLoggedIn(false);
      setCurrentUser(null);
      navigate('/login');
    }
  };

  // --- Render ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      {/* Header / Logout Button */}
      {loggedIn && (
        <div className="max-w-4xl mx-auto flex justify-end mb-6">
          <button
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded shadow transition-colors"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={loggedIn ? '/memos' : '/login'} replace />}
          />
          
          <Route
            path="/login"
            element={loggedIn ? <Navigate to="/memos" replace /> : <LoginForm onSuccess={handleLoginSuccess} />}
          />
          
          <Route
            path="/register"
            element={loggedIn ? <Navigate to="/memos" replace /> : <RegisterForm onSuccess={handleLoginSuccess} />}
          />
          
          <Route
            path="/memos"
            element={loggedIn ? <MemoList currentUser={currentUser} /> : <Navigate to="/login" replace />}
          />

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default AppWrapper;