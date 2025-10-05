
import "../index.css";
import { useParams } from "react-router-dom";
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
        <div className="min-h-screen flex items-start justify-center pt-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <div className="card w-96 bg-black shadow-xl rounded-2xl">
        <div className="card-body">
            {note? (
            <>
                <h2 className="card-title justify-center">{note.title}</h2>
                <p className="">{note.content}</p>
            </>
            ) : (
            <p>Loading...</p> )}
        </div>
        </div>
        </div>
    );
}
