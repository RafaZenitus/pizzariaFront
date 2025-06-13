import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.18.5:8080', 
});

export default api;
