

export async function loadDashboard(userId) {
  const res = await fetch(`/api/notes/user/${userId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch notes");
  }
  return res.json();
}
