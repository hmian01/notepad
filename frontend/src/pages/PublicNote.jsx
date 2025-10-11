
import "../index.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { getPublicNote } from "../api/notesApi";

// TODO: later will implement features where user can changes settings to make the note publically editable as well
export default function PublicNote() {

    const { publicId } = useParams();    
    const [note, setNote] = useState(null);

    useEffect(() => {
        getPublicNote(publicId)
            .then(setNote)
                .catch(console.error);

                
    }, [publicId]);


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
