import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { addNote } from "../api/notesApi";
import "../index.css";

export default function CreateNote() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [note, setNote] = useState({
    title: "",
    content: "",
    isPrivate: true,
  });
  const [status, setStatus] = useState("idle");
  const timersRef = useRef([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, []);

  const schedule = (fn, delay) => {
    const timer = setTimeout(fn, delay);
    timersRef.current.push(timer);
  };

  const buttonBackground = {
    idle: "linear-gradient(90deg,#34d399 0%,#10b981 100%)",
    loading: "linear-gradient(90deg,#6ee7b7 0%,#22d3ee 100%)",
    success: "linear-gradient(90deg,#34d399 0%,#10b981 100%)",
    error: "linear-gradient(90deg,#f97316 0%,#ef4444 100%)",
  };

  const buttonLabel = {
    idle: "Create note",
    loading: "Creating…",
    success: "✅ Note created",
    error: "Failed to create",
  };

  const handleContentKeyDown = event => {
    if (event.key !== "Tab") return;
    event.preventDefault();
    const target = event.target;
    const { selectionStart, selectionEnd, value } = target;
    const insert = "\t";
    const updated =
      value.slice(0, selectionStart) + insert + value.slice(selectionEnd);
    setNote(prev => ({ ...prev, content: updated }));
    requestAnimationFrame(() => {
      target.selectionStart = target.selectionEnd = selectionStart + insert.length;
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!auth) return;

    setStatus("loading");
    try {
      const created = await addNote(auth, note);
      setStatus("success");
      schedule(() => navigate(`/note/${created.id}`), 900);
    } catch (err) {
      console.error("Failed to create note", err);
      setStatus("error");
      schedule(() => setStatus("idle"), 1800);
    }
  };

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        <p>Please sign in to create notes.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-16 px-4">
      <div className="max-w-6xl mx-auto w-full">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start">
            {/* Meta panel */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="bg-base-200/90 border border-white/10 backdrop-blur rounded-3xl shadow-2xl p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/60">New note</p>
                    <input
                      type="text"
                      name="title"
                      value={note.title}
                      onChange={e => setNote(prev => ({ ...prev, title: e.target.value }))}
                      className="mt-3 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-base font-semibold text-white placeholder:text-white/40 focus:border-indigo-300 focus:outline-none"
                      placeholder="Give your note a title"
                      required
                    />
                  </div>

                  <div className="bg-black/40 border border-white/10 rounded-2xl px-4 py-4 space-y-3">
                    <div className="flex w-full bg-white/10 rounded-full px-1 py-1 text-xs font-semibold text-white/70 select-none">
                      <button
                        type="button"
                        aria-pressed={note.isPrivate}
                        onClick={() => setNote(prev => ({ ...prev, isPrivate: true }))}
                        className={`flex-1 py-2 rounded-full transition-all cursor-pointer ${
                          note.isPrivate
                            ? "bg-white text-purple-600 shadow-lg shadow-purple-500/30"
                            : "hover:text-white"
                        }`}
                      >
                        Private
                      </button>
                      <button
                        type="button"
                        aria-pressed={!note.isPrivate}
                        onClick={() => setNote(prev => ({ ...prev, isPrivate: false }))}
                        className={`flex-1 py-2 rounded-full transition-all cursor-pointer ${
                          !note.isPrivate
                            ? "bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg shadow-pink-500/30"
                            : "hover:text-white"
                        }`}
                      >
                        Public
                      </button>
                    </div>
                    <p className="text-xs text-center text-white/60">
                      {note.isPrivate
                        ? "Notes start private by default."
                        : "A shareable link will be created after saving."}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                  <p>Need inspiration? Start with a checklist, daily plan, or quick reminder.</p>
                  <Link
                    to="/dashboard"
                    className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-white hover:text-indigo-200"
                  >
                    View your notes &rarr;
                  </Link>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/70 hover:text-white hover:border-white/40 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className={`rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg transition duration-200 cursor-pointer ${
                      status === "success" ? "animate-pulse" : ""
                    } ${status === "loading" ? "opacity-90" : ""}`}
                    style={{ background: buttonBackground[status] || buttonBackground.idle }}
                  >
                    {buttonLabel[status] ?? buttonLabel.idle}
                  </button>
                </div>
              </div>
            </aside>

            {/* Content composer */}
            <section className="bg-base-200 shadow-xl rounded-3xl p-6 lg:p-10 space-y-6">
              <div className="bg-base-100 p-6 rounded-2xl">
                {/* <label className="block text-sm font-semibold text-white/70 mb-3">Content</label> */}
                <textarea
                  name="content"
                  value={note.content}
                  onChange={e => setNote(prev => ({ ...prev, content: e.target.value }))}
                  onKeyDown={handleContentKeyDown}
                  placeholder="Draft your note here…"
                  className="textarea textarea-bordered w-full min-h-[320px] resize-y bg-white/5 text-white placeholder:text-white/40 focus:border-indigo-300 focus:outline-none"
                />
              </div>
            </section>
          </div>
        </form>
      </div>
    </div>
  );
}
