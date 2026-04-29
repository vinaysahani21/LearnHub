import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api/api';

// 🔥 VITAL: Tells Axios to send HTTP-Only cookies with every request
axios.defaults.withCredentials = true; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        // Ping the backend. If the HTTP-Only cookie is valid, this returns the user.
        const res = await api.get(`/auth/me`);
        setUser(res.data);
      } catch (err) {
        setUser(null); // No valid cookie found
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = (userData) => {
    // We no longer manually store the token. The browser handles the cookie automatically!
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post(`/auth/logout`);
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);