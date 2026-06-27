import axios from 'axios';

const request = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (res) => {
    if (res.data.code === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return res.data;
  },
  (err) => {
    return Promise.reject(err);
  },
);

export default request;
