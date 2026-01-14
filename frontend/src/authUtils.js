const TOKEN_KEY = 'jwt_token';

/**
 * Save the JWT token to the browser's local storage.
 */
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Get the JWT token from local storage.
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove the JWT token from local storage (Logout).
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Check if the user is currently logged in (token exists).
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Get the Authorization header for API requests.
 * Returns an empty object if no token is found.
 */
export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
