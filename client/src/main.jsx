import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <GoogleOAuthProvider clientId={clientId}>
          <App />
        </GoogleOAuthProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
)
