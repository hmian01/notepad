import { Link } from "react-router-dom";
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
            <Link to={`/note/${note.id}`} className="block">
              <div key={note.id} className="card h-64 bg-base-200 shadow-xl hover:shadow-2xl transition hover:scale-105 duration-200">
                <div className="card-body flex flex-col justify-between">

                  <h3 className="card-title justify-center">{note.title}</h3>
                  <div className="bg-base-100 p-4 rounded-2xl">
                    <p className="text-sm text-white-300 line-clamp-5 break-words whitespace-pre-line">{note.content}</p>
                  </div>
                  <div className="card-actions justify-end mt-2"> 
                    <Link to={`/note/${note.id}/edit`} className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md px-3 py-1">
                      Edit
                    </Link>
                  </div>

                </div>
              </div>
            </Link>
          ))}
        </div>
        )}
      <footer className="footer p-20"></footer>
    </div>
  );

}
