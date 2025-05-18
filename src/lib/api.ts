import axios from 'axios';


const api = axios.create({
  baseURL: '/api/proxy',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  console.log('Requesting:', config.url);
  return config;
});

export default api;