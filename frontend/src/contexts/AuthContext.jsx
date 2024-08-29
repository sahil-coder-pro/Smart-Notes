import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { loginUser, signupUser, refreshToken } from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  const initializeAuth = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setAuthChecked(true);
        return;
      }

      // Verify existing token
      const { data } = await API.get('/users/me');
      setUser(data.data.user);
    } catch (err) {
      try {
        // Refresh tokens if invalid
        const { accessToken, refreshToken: newRefreshToken } = await refreshToken();
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        // Get fresh user data
        const { data } = await API.get('/users/me');
        setUser(data.data.user);
      } catch (error) {
        logout();
      }
    } finally {
      setAuthChecked(true);
    }
  };

  const login = async (email, password) => {
    const { accessToken, refreshToken, user } = await loginUser(email, password);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(user);
    navigate('/');
  };

  const signup = async (name, email, password) => {
    await signupUser(name, email, password);
    navigate('/');
  };

  const logout = () => {
    console.log(document.cookie) ;
    localStorage.clear();
    sessionStorage.clear() ;

    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading: !authChecked,
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);