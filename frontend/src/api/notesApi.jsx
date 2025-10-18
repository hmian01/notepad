
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export function loadDashboard(auth) {
  return api
    .get("/notes", {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })
}

export function addNote(auth, note) {
  return api.post("/notes", 
    note,
    {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });
}

export function getNote(auth, noteId) {
  return api.get(`/notes/${noteId}`, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });
}

export function updateNote(auth, id, updates) {
  return api.patch(`/notes/${id}`, 
    updates,
    {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });
}

export function deleteNote(auth, id) {
  return api.delete(`/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });
}

export async function getPublicNote(publicId) {
  return api.get(`/notes/public/${publicId}`);
}
