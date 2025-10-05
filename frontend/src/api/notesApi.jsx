

export async function loadDashboard(userId) {
  const res = await fetch(`/api/notes/user/${userId}`, {
    method: "GET",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch notes");
  }
  return res.json();
}

export async function addNote(userId, note) {
  const res = await fetch(`/api/notes?userId=${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  if (!res.ok) {
    throw new Error("Failed to add note");
  }
  return res.json();
}

export async function getNote(noteId) {
  const res = await fetch(`/api/notes/${noteId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Failed to get note #${noteId}`);
  }
  return res.json();
}

export async function updateNote(id, updates) {
  const res = await fetch(`/api/notes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    throw new Error(`Failed to update note #${id}`);
  }
  return res.json();
}

export async function deleteNote(id) {
  const res = await fetch(`/api/notes/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Failed to delete note #${id}`);
  }
  return res;
}
