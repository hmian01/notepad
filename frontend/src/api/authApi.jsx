// api.jsx
import axios from 'axios';

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL;

const api = axios.create({
  baseURL: BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function signup(name, email, password) {
  return api.post('/users/signup', { name, email, password });
}

export function signin(email, password) {
  return api.post('/users/signin', { email, password });
}
