
import "../index.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { getNote, deleteNote } from "../api/notesApi";
import { AuthContext } from "../context/AuthContext";

export default function Note() {

    const { auth } = useContext(AuthContext);
    const { id } = useParams();
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();
    
    const [note, setNote] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        if (auth)
            getNote(auth, id)
                .then(setNote)
                .catch(console.error);
    }, [auth, id]);

    async function handleDelete(e) {
        try {
            await deleteNote(auth, id);
            navigate("/dashboard");
        } catch (err) {
            console.error("Error deleting note", err);
        }
    };

    const handleCopy = async () => {
        const link = `${window.location.origin}/public/${note.publicId}`;
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };


    return (
        <div className="min-h-screen flex items-start justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-15">
        <div className="card w-full max-w-xl bg-base-200 shadow-xl">
        <div className="card-body">
            {note? (
            <>
            <h1 className="card-title text-3xl text-primary justify-center mb-6">{note.title}</h1>
                <div className="bg-base-100 p-4 rounded-2xl">
                    <p className="text-center break-words leading-relaxed whitespace-pre-line">{note.content}</p>
                </div>
                <div className="card-actions justify-between mt-5">
                    
                    
                    <div>
                        <button className="btn btn-sm btn-error normal-case py-5 text-white" onClick={() => setShowDeleteModal(true)}>Delete</button>
                        {!note.isPrivate && <button className={`btn ${copied ? "btn-success" : "btn-primary"} ml-5`} onClick={handleCopy}>
                            {copied ? "Copied Link!" : "Copy Public Link"}
                        </button>}
                    </div>

                    <Link to={`/note/${note.id}/edit`} className="btn btn-primary">
                        Edit
                    </Link>
                    
                </div>

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

            </>
            ) : (
            <div className="flex justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
            )}
        </div>
        </div>
        </div>
    );
}
