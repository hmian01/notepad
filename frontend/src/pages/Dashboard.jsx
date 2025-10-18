import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loadDashboard } from "../api/notesApi";
import "../index.css";

const filters = [
  { id: "all", label: "All notes" },
  { id: "private", label: "Private" },
  { id: "public", label: "Shared" },
];

const categories = [
  { id: "morning", label: "Morning routines" },
  { id: "planning", label: "Planning" },
  { id: "personal", label: "Personal" },
];

export default function Dashboard() {
  const { auth } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!auth) return;

    setLoading(true);
    loadDashboard(auth)
      .then(setNotes)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [auth]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return notes
      .filter(note => {
        if (filter === "private" && !note.isPrivate) return false;
        if (filter === "public" && note.isPrivate) return false;
        return true;
      })
      .filter(note => {
        if (!term) return true;
        return (
          note.title.toLowerCase().includes(term) ||
          note.content.toLowerCase().includes(term)
        );
      });
  }, [notes, filter, search]);

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        <p>Please sign in to access your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-16 px-4 text-white">
      <div className="max-w-6xl mx-auto w-full space-y-10">
        {/* Hero */}
        <header className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">Dashboard</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-extrabold leading-tight">Welcome back, {auth.name}</h1>
              <p className="text-white/80 max-w-3xl">
                Review everything you captured recently and jump back into the notes that matter. Use the filters below to view private drafts or shared updates.
              </p>
            </div>
          </div>
        </header>

        {/* Controls */}
        <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="bg-base-200/80 border border-white/10 backdrop-blur rounded-3xl shadow-xl p-6">
            <label className="block text-sm font-semibold text-white/70 mb-3">
              Search notes
            </label>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title or note content…"
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-indigo-300 focus:outline-none"
            />
            <div className="mt-4 flex gap-2">
              {filters.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                    filter === item.id
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center items-center">
            <Link
              to="/create"
              className="inline-flex items-center gap-3 rounded-3xl border border-white/20 bg-white/10 px-6 py-4 text-lg font-semibold text-white shadow-md transition hover:bg-white/20 hover:-translate-y-0.5"
            >
              <span className="text-base leading-none">＋</span>
              <span>Create note</span>
            </Link>
          </div>
            
          {/* TODO: add quick filters or search history*/}
          { /* <div className="space-y-4">
            <div className="bg-base-200/80 border border-white/10 backdrop-blur rounded-3xl shadow-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white">Quick filters</h2>
              <div className="grid grid-cols-1 gap-2">
                {categories.map(item => (
                  <button
                    key={item.id}
                    type="button"
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold text-white/70 hover:text-white hover:border-white/20 transition text-left"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div> */}
          
        </section>

        {/* Content */}
        <section className="space-y-6">
          {loading ? (
            <div className="flex justify-center pt-10">
              <span className="loading loading-spinner loading-lg text-white"></span>
            </div>
          ) : error ? (
            <div className="rounded-3xl bg-black/50 border border-white/10 px-6 py-12 text-center">
              <h2 className="text-2xl font-semibold mb-2">We had trouble loading your notes</h2>
              <p className="text-white/70 mb-4">{error}</p>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  loadDashboard(auth)
                    .then(setNotes)
                    .catch(err => setError(err.message))
                    .finally(() => setLoading(false));
                }}
                className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition"
              >
                Try again
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl bg-black/40 border border-white/10 px-6 py-16 text-center space-y-4">
              <h2 className="text-2xl font-semibold">No notes match your filters yet</h2>
              <p className="text-white/70">
                Start a new note or adjust your filters to see more results.
              </p>
              <Link
                to="/create"
                className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition"
              >
                Create your first note
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map(note => (
                <article
                  key={note.id}
                  className="group flex h-full flex-col rounded-3xl border border-white/10 bg-base-200/60 p-6 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <Link to={`/note/${note.id}`} className="flex-1 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold text-white">
                        {note.title || "Untitled note"}
                      </h3>
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                          note.isPrivate ? "bg-white/10 text-white/70" : "bg-emerald-400/20 text-emerald-200"
                        }`}
                      >
                        {note.isPrivate ? "Private" : "Shared"}
                      </span>
                    </div>
                    <div className="rounded-2xl bg-base-100/80 p-4">
                      <p className="text-sm text-white/80 line-clamp-5 whitespace-pre-line break-words">
                        {note.content || "No content yet."}
                      </p>
                    </div>
                  </Link>
                  <div className="mt-4 flex items-center justify-between text-xs text-white/60">
                    <span>#{note.id}</span>
                    <Link
                      to={`/note/${note.id}/edit`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-indigo-200"
                    >
                      Edit
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
