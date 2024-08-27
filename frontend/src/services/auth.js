import API from './api';

// Login user
export const loginUser = async (email, password) => {
  const response = await API.post('/users/login', { email, password });
  return {
    accessToken: response.data.data.accessToken,
    refreshToken: response.data.data.refreshToken,
    user: response.data.data.user
  };
};

// Signup user
export const signupUser = async (name, email, password) => {
  const response = await API.post('/users/signup', { name, email, password });
  return {
    accessToken: response.data.data.accessToken,
    refreshToken: response.data.data.refreshToken,
    user: response.data.data.user
  };
};

// Refresh tokens
export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await API.patch('/users/refresh', { refreshToken });
  return {
    accessToken: response.data.data.accessToken,
    refreshToken: response.data.data.refreshToken
  };
};