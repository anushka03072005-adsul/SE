import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

api.setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('access_token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('access_token');
  }
};

// initialize from storage
const stored = localStorage.getItem('access_token');
if (stored) api.setAuthToken(stored);

export default api;
