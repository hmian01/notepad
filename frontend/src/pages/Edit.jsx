import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getNote, updateNote } from "../api/notesApi";
import "../index.css";

export default function EditNote() {
  const { auth } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("idle");
  const timersRef = useRef([]);
  const [note, setNote] = useState({
    title: "",
    content: "",
    isPrivate: true,
  });

  useEffect(() => {
    if (!auth) return;

    setLoading(true);
    getNote(auth, id)
      .then(data => {
        setNote({
          title: data.title,
          content: data.content,
          isPrivate: data.isPrivate,
        });
      })
      .catch(err => {
        console.error("Failed to load note", err);
      })
      .finally(() => setLoading(false));

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [auth, id]);

  const schedule = (fn, delay) => {
    const timer = setTimeout(fn, delay);
    timersRef.current.push(timer);
  };

  const buttonBackground = {
    idle: "linear-gradient(90deg,#6366f1 0%,#a855f7 50%,#ec4899 100%)",
    loading: "linear-gradient(90deg,#818cf8 0%,#a855f7 50%,#f472b6 100%)",
    success: "linear-gradient(90deg,#34d399 0%,#059669 100%)",
    error: "linear-gradient(90deg,#f97316 0%,#ef4444 100%)",
  };

  const buttonLabel = {
    idle: "Save changes",
    loading: "Saving…",
    success: "✅ Saved",
    error: "Update failed",
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!auth) return;

    setStatus("loading");
    try {
      await updateNote(auth, id, {
        title: note.title,
        content: note.content,
        isPrivate: note.isPrivate,
      });
      setStatus("success");
      schedule(() => navigate(`/note/${id}`), 800);
    } catch (err) {
      console.error("Failed to update note", err);
      setStatus("error");
      schedule(() => setStatus("idle"), 1800);
    }
  };

  const handleCancel = () => {
    navigate(`/note/${id}`);
  };

  const handlePrivacyToggle = nextValue => {
    setNote(prev => ({
      ...prev,
      isPrivate: nextValue,
    }));
  };

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        <p>Please sign in to edit notes.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-16 px-4">
      <div className="max-w-6xl mx-auto w-full">
        {loading ? (
          <div className="flex justify-center pt-20">
            <span className="loading loading-spinner loading-lg text-white"></span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-8 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start">
              {/* Meta + actions */}
              <aside className="lg:sticky lg:top-24 lg:self-start">
                <div className="bg-base-200/90 border border-white/10 backdrop-blur rounded-3xl shadow-2xl p-6 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/60">Editing</p>
                      <input
                        type="text"
                        name="title"
                        value={note.title}
                        onChange={e => setNote(prev => ({ ...prev, title: e.target.value }))}
                        className="mt-3 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-base font-semibold text-white placeholder:text-white/40 focus:border-indigo-300 focus:outline-none"
                        placeholder="Note title"
                        required
                      />
                    </div>

                    <div className="bg-black/40 border border-white/10 rounded-2xl px-4 py-4 space-y-3">
                      <div className="flex w-full bg-white/10 rounded-full px-1 py-1 text-xs font-semibold text-white/70 select-none">
                        <button
                          type="button"
                          aria-pressed={note.isPrivate}
                          onClick={() => handlePrivacyToggle(true)}
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
                          onClick={() => handlePrivacyToggle(false)}
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
                          ? "Only you can see this note."
                          : "Anyone with the link can view this note."}
                      </p>
                    </div>
                  </div>


                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/70 hover:text-white hover:border-white/40 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className={`rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg transition duration-200 cursor-pointer${
                        status === "success" ? "animate-pulse" : ""
                      } ${status === "loading" ? "opacity-90" : ""}`}
                      style={{ background: buttonBackground[status] || buttonBackground.idle }}
                    >
                      {buttonLabel[status] ?? buttonLabel.idle}
                    </button>
                  </div>
                </div>
              </aside>

              {/* Content editor */}
              <section className="bg-base-200 shadow-xl rounded-3xl p-6 lg:p-10 space-y-6">
                <div className="bg-base-100 p-6 rounded-2xl">
                  {/* <label className="block text-sm font-semibold text-white/70 mb-3">Content</label> */}
                  <textarea
                    name="content"
                    value={note.content}
                    onChange={e => setNote(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write or update the note content here…"
                    className="textarea textarea-bordered w-full min-h-[320px] resize-y bg-white/5 text-white placeholder:text-white/40 focus:border-indigo-300 focus:outline-none"
                  />
                </div>
              </section>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
