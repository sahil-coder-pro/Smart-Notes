import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { loginUser, signupUser, refreshToken } from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const initializeAuth = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await API.get('/users/me');
      setUser(data.data.user);
    } catch (err) {
      try {
        const { accessToken, refreshToken } = await refreshToken();
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        const { data } = await API.get('/users/me');
        setUser(data.data.user);
      } catch (error) {
        logout();
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const { accessToken, refreshToken, user } = await loginUser(email, password);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(user);
    navigate('/');
  };

  const signup = async (name, email, password) => {
    const { accessToken, refreshToken, user } = await signupUser(name, email, password);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(user);
    navigate('/');
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);