import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicNote } from "../api/notesApi";
import "../index.css";

export default function PublicNote() {
  const { publicId } = useParams();
  const [note, setNote] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getPublicNote(publicId)
      .then(setNote)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [publicId]);

  const handleCopyContent = async () => {
    if (!note) return;
    try {
      await navigator.clipboard.writeText(note.content ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error("Failed to copy content:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-16 px-4">
      <div className="max-w-3xl mx-auto w-full">
        {loading ? (
          <div className="flex justify-center pt-20">
            <span className="loading loading-spinner loading-lg text-white"></span>
          </div>
        ) : error ? (
          <div className="rounded-3xl bg-black/60 border border-white/10 px-6 py-10 text-center text-white">
            <h2 className="text-2xl font-semibold mb-3">Unable to load note</h2>
            <p className="text-white/70">{error}</p>
          </div>
        ) : note ? (
          <div className="bg-base-200 shadow-2xl rounded-3xl p-6 sm:p-10 space-y-8">
            <div className="flex flex-col gap-4">
              <div className="relative flex flex-col items-center text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Shared note</p>
                <h1 className="text-3xl font-semibold text-white mt-3">{note.title}</h1>
                <button
                  type="button"
                  onClick={handleCopyContent}
                  className="absolute right-0 top-0 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition cursor-pointer"
                  aria-label="Copy note content"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M6 2a2 2 0 0 0-2 2v8h2V4h6V2H6Zm4 4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-6Zm0 2h6v8h-6V8Z" />
                  </svg>
                  <span className="inline-block w-[60px] text-center">{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>

            <div className="bg-base-100 p-6 rounded-2xl">
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap break-words text-white leading-relaxed">{note.content}</pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-black/60 border border-white/10 px-6 py-10 text-center text-white">
            <h2 className="text-2xl font-semibold mb-3">Note not found</h2>
            <p className="text-white/70">The note you are looking for may have been removed.</p>
          </div>
        )}
      </div>
    </div>
  );
}
