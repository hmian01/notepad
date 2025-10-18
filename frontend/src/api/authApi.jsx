// api.jsx
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export function signup(name, email, password) {
  return api.post('/api/users/signup', { name, email, password });
}

export function signin(email, password) {
  return api.post('/api/users/signin', { email, password });
}