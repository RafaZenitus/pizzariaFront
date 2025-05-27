import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.166.78:8080', 
});

export default api;
