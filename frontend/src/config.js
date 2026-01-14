/**
 * Base URL for the backend API.
 * Uses 'REACT_APP_API_URL' from environment variables if available.
 * Defaults to 'http://localhost:8080' for local development.
 */
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
