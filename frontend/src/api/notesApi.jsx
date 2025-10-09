
export async function loadDashboard(auth) {
  const res = await fetch(`/api/notes/user/${auth.userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", "Authorization" : `Bearer ${auth.token}`},
  });
  if (!res.ok) {
    throw new Error("Failed to fetch notes");
  }
  return res.json();
}

export async function addNote(auth, note) {
  const res = await fetch(`/api/notes?userId=${auth.userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization" : `Bearer ${auth.token}`},
    body: JSON.stringify(note),
  });
  if (!res.ok) {
    throw new Error("Failed to add note");
  }
  return res.json();
}

export async function getNote(auth, noteId) {
  const res = await fetch(`/api/notes/${noteId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", "Authorization" : `Bearer ${auth.token}`},
  });
  if (!res.ok) {
    throw new Error(`Failed to get note #${noteId}`);
  }
  return res.json();
}

export async function updateNote(auth, id, updates) {
  const res = await fetch(`/api/notes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "Authorization" : `Bearer ${auth.token}`},
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    throw new Error(`Failed to update note #${id}`);
  }
  return res.json();
}

export async function deleteNote(auth, id) {
  const res = await fetch(`/api/notes/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", "Authorization" : `Bearer ${auth.token}`},
  });
  if (!res.ok) {
    throw new Error(`Failed to delete note #${id}`);
  }
  return res;
}
