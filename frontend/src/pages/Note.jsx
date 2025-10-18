
import "../index.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { getNote, deleteNote, updateNote } from "../api/notesApi";
import { AuthContext } from "../context/AuthContext";

export default function Note() {
    const { auth } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [copied, setCopied] = useState(false);
    const [contentCopied, setContentCopied] = useState(false);

    const [note, setNote] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [pendingVisibility, setPendingVisibility] = useState(null);

    useEffect(() => {
        if (!auth) return;
        getNote(auth, id)
            .then(setNote)
            .catch(console.error);
    }, [auth, id]);

    async function handleDelete() {
        try {
            await deleteNote(auth, id);
            navigate("/dashboard");
        } catch (err) {
            console.error("Error deleting note", err);
        }
    }

    const handleCopyLink = async () => {
        if (!note) return;
        const link = `${window.location.origin}/public/${note.publicId}`;
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleCopyContent = async () => {
        if (!note) return;
        try {
            await navigator.clipboard.writeText(note.content ?? "");
            setContentCopied(true);
            setTimeout(() => setContentCopied(false), 1200);
        } catch (err) {
            console.error("Failed to copy content:", err);
        }
    };

    const updateVisibility = async (nextIsPrivate) => {
        if (!auth || !note) return;
        try {
            const updated = await updateNote(auth, note.id, { isPrivate: nextIsPrivate });
            setNote(updated);
            setPendingVisibility(null);
            setShowShareModal(false);
            if (nextIsPrivate) setCopied(false);
        } catch (err) {
            console.error("Failed to update visibility", err);
        }
    };

    const handleVisibilityToggle = (nextIsPrivate) => {
        if (!note || note.isPrivate === nextIsPrivate) return;
        setCopied(false);
        setPendingVisibility(nextIsPrivate);
        setShowShareModal(true);
    };

    const visibilityDescription = note?.isPrivate
        ? "Visible only to you."
        : "Anyone with the link can view.";

    const isMakingPublic = pendingVisibility === false;
    const modalTitle = isMakingPublic ? "Make note public?" : "Make note private?";
    const modalDescription = isMakingPublic
        ? "Anyone with the generated link will be able to read this note. You can switch it back to private whenever you need."
        : "The public link will stop working, and only you will be able to view this note.";
    const modalConfirmLabel = isMakingPublic ? "Make public" : "Make private";

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-16 px-4">
            <div className="max-w-6xl mx-auto w-full">
                {note ? (
                    <div className="grid gap-8 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start">
                        {/* Side panel: sharing toggle and key actions */}
                        <aside className="lg:sticky lg:top-24 lg:self-start">
                            <div className="bg-base-200/90 border border-white/10 backdrop-blur rounded-3xl shadow-2xl p-6 space-y-6 lg:h-fit">
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-white leading-tight">{note.title}</h2>
                                    <div className="bg-black/40 border border-white/10 rounded-2xl px-4 py-4 space-y-3">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex w-full bg-white/10 rounded-full px-1 py-1 text-xs font-semibold text-white/70 cursor-pointer">
                                                <button
                                                    type="button"
                                                    aria-pressed={note.isPrivate}
                                                    onClick={() => handleVisibilityToggle(true)}
                                                    className={`flex-1 py-1.5 rounded-full transition-all cursor-pointer ${
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
                                                    onClick={() => handleVisibilityToggle(false)}
                                                    className={`flex-1 py-1.5 rounded-full transition-all cursor-pointer ${
                                                        !note.isPrivate
                                                            ? "bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg shadow-pink-500/30"
                                                            : "hover:text-white"
                                                    }`}
                                                >
                                                    Public
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-xs text-center text-white/60">{visibilityDescription}</p>
                                    </div>
                                </div>

                                <div className="min-h-[2.75rem]">
                                    {!note.isPrivate && (
                                        <button
                                            className={`w-full inline-flex items-center justify-center gap-2 text-xs font-semibold rounded-full border border-white/20 px-3 py-1.5 transition cursor-pointer ${
                                                copied
                                                    ? "bg-emerald-500/20 text-emerald-200"
                                                    : "bg-white/5 text-white/70 hover:text-white"
                                            }`}
                                            onClick={handleCopyLink}
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
                                            <span>{copied ? "Link copied" : "Copy public link"}</span>
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <button
                                        className="btn btn-sm btn-error text-white"
                                        onClick={() => setShowDeleteModal(true)}
                                    >
                                        Delete
                                    </button>
                                    <Link
                                        to={`/note/${note.id}/edit`}
                                        className="btn btn-primary btn-sm"
                                    >
                                        Edit Note
                                    </Link>
                                </div>
                            </div>
                        </aside>

                        {/* Note content */}
                        <section className="bg-base-200 shadow-xl rounded-3xl p-6 lg:p-10 space-y-6">
                            <div className="bg-base-100 p-6 rounded-2xl relative">
                                <button
                                    type="button"
                                    onClick={handleCopyContent}
                                    className="absolute top-4 right-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white hover:bg-white/20 transition cursor-pointer"
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
                                    <span>{contentCopied ? "Copied" : "Copy"}</span>
                                </button>
                                <div className="prose prose-invert max-w-none">
                                    <pre className="whitespace-pre-wrap break-words text-white leading-relaxed">{note.content}</pre>
                                </div>
                            </div>
                        </section>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                )}
            </div>

            {/* Delete confirmation modal */}
            {showDeleteModal && (
                <dialog open className="modal modal-open">
                    <div className="modal-box bg-base-200">
                        <h3 className="font-bold text-lg text-white text-center">Confirm Deletion</h3>
                        <div className="bg-base-100 p-2 mt-5 rounded-2xl">
                            <p className="py-4 text-white">Are you sure you want to permanently delete this note?</p>
                        </div>
                        <div className="modal-action">
                            <button className="btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="btn btn-error text-white" onClick={handleDelete}>Yes, Delete</button>
                        </div>
                    </div>
                </dialog>
            )}

            {/* Public/private confirmation modal */}
            {showShareModal && (
                <dialog open className="modal modal-open">
                    <div className="modal-box bg-base-200">
                        <h3 className="font-bold text-lg text-white text-center">{modalTitle}</h3>
                        <div className="bg-base-100 p-3 mt-5 rounded-2xl text-sm text-white">
                            <p>{modalDescription}</p>
                        </div>
                        <div className="modal-action">
                            <button className="btn" onClick={() => {
                                setShowShareModal(false);
                                setPendingVisibility(null);
                            }}>Cancel</button>
                            <button
                                className="btn btn-primary text-white"
                                disabled={pendingVisibility === null}
                                onClick={() => pendingVisibility !== null && updateVisibility(pendingVisibility)}
                            >
                                {modalConfirmLabel}
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
}
