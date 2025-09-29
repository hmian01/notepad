

export async function loadDashboard(userId) {
  const res = await fetch(`/api/notes/user/${userId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch notes");
  }
  return res.json();
}

export async function addNote(userId, note) {
  const res = await fetch(`/api/notes/user/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  });
  if (!res.ok) {
    throw new Error("Failed to add note");
  }
  return res.json();
}
