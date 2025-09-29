import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { loadDashboard } from "../api/notesApi";

export default function Dashboard() {
  const { user } = useContext(AuthContext); // logged in user
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    loadDashboard(user.id)
      .then(setNotes)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <p>Please sign in to access your dashboard.</p>;
  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Welcome back, {user.name}!
      </h1>

      <h2 className="text-xl font-semibold mb-2">Your Notes</h2>
      {notes.length === 0 ? (
        <p>You have no notes yet.</p>
      ) : (
        <ul className="space-y-2">
          {notes.map(note => (
            <li key={note.id} className="p-3 border rounded bg-white">
              <h3 className="font-semibold">{note.title}</h3>
              <p>{note.content}</p>
              <span className="text-xs text-gray-500">
                {note.isPrivate ? "Private" : "Public"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
