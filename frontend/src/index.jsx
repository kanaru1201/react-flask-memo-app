import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Initialize the React application
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component wrapped in StrictMode for development checks
root.render(
  <React.StrictMode>
    <App /> 
  </React.StrictMode>
);