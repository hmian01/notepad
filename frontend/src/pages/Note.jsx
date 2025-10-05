
import "../index.css";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getNote } from "../api/notesApi";

export default function Note() {

    const { id } = useParams();
    const [note, setNote] = useState(null);


    useEffect(() => {
        getNote(id)
            .then(setNote)
            .catch(console.error);
    }, [id]);


    return (
        <div className="min-h-screen flex items-start justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-15">
        <div className="card w-full max-w-xl bg-base-200 shadow-xl">
        <div className="card-body">
            {note? (
            <>
            <h1 className="card-title text-3xl text-primary justify-center mb-6">{note.title}</h1>
                <div className="bg-base-100 p-4 rounded-2xl">
                    <p className="text-center break-words leading-relaxed">{note.content}</p>
                </div>
                <div className="card-actions justify-end mt-5"> 
                    <Link to={`/note/${note.id}/edit`} className="btn btn-primary">
                        Edit
                    </Link>
                </div>
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
