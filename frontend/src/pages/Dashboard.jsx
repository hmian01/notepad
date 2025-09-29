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
    <div className="text-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-5">
      <h1 className="text-3xl font-extrabold text-white mb-6 pt-15 pb-5">  Welcome back, {user.name}! </h1>
      <h2 className="text-xl font-semibold text-white mb-6">Your Notes</h2>
      {notes.length === 0 ? (
        <p className="text-white text-lg">You have no notes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {notes.map(note => (
            <div key={note.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition hover:scale-105 duration-200">
              <div className="card-body">
                <h3 className="card-title justify-center">{note.title}</h3>
                <p className="text-white">{note.content}</p>
              </div>
            </div>
          ))}
        </div>
        )}
      <footer className="footer p-20"></footer>
    </div>
  );

}
