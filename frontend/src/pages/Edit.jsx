import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { addNote } from "../api/notesApi";
import { useNavigate, useParams } from "react-router-dom";
import { getNote, updateNote } from "../api/notesApi";

export default function Create() {
    const { auth } = useContext(AuthContext);

    const { id } = useParams();
    const navigate = useNavigate();
    

    const [note, setNote] = useState({
        title: "",
        content: "",
        isPrivate: false,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getNote(auth, id)
            .then((data) =>{
                setNote({
                    title: data.title,
                    content: data.content,
                    isPrivate: data.isPrivate
                })
                setLoading(false)
                console.log(data)
            })
            .catch(console.error); // TODO: add some additional error handling
    }, [id]);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await updateNote(auth, id, {
                title: note.title,
                content: note.content,
                isPrivate: note.isPrivate,
            });
            navigate(`/note/${id}`);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="min-h-screen flex items-start justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-15">
        <div className="card w-full max-w-xl bg-base-100 shadow-xl">
            <div className="card-body">
            <h1 className="card-title text-2xl justify-center mb-6">Edit Note</h1>

                {loading? 
                    <div className="flex justify-center">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                    :
                    <form onSubmit={handleSubmit}>
                        <label className="block mb-2 text-lg font-semibold">Title</label>
                        <input type="text" placeholder="Title" value={note.title} onChange={(e) => setNote({ ...note, title: e.target.value })} className="input input-bordered w-full mb-4" required/>

                        <label className="block mb-2 text-lg font-semibold">Content</label>
                        <textarea placeholder="Content" value={note.content} onChange={(e) => setNote({ ...note, content: e.target.value })} className="textarea textarea-bordered w-full h-40 mb-4"/>

                        <label className="label cursor-pointer">
                            <span className="label-text">Private</span>
                            <input type="checkbox" checked={note.isPrivate} onChange={(e) => setNote({ ...note, isPrivate: e.target.checked })} className="checkbox checkbox-primary"/>
                        </label>

                        <div className="card-actions justify-end mt-6">
                            <button className="btn btn-ghost" onClick={() => navigate(`/note/${id}`)}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Save</button>
                        </div>
                    </form>
                }
            </div>
        </div>
        </div>
    );
}
