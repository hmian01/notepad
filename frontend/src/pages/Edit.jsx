import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { addNote } from "../api/notesApi";
import { useNavigate, useParams } from "react-router-dom";
import { getNote, updateNote } from "../api/notesApi";

export default function Create() {
    // const { user } = useContext(AuthContext); // logged in user --> TODO: will be used later

    const { id } = useParams();
    const navigate = useNavigate();
    

    const [note, setNote] = useState({
        title: "",
        content: "",
        isPrivate: false,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getNote(id)
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
            await updateNote(id, {
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
            <div className="card-body">
            <h2 className="card-title">Edit Note</h2>

                {loading? 
                    <p>Loading...</p>
                    :
                    <form onSubmit={handleSubmit}>
                        <label>Title</label>
                        <input type="text" placeholder="Title" value={note.title} onChange={(e) => setNote({ ...note, title: e.target.value })} className="input input-bordered w-full" required/>

                        <label>Content</label>
                        <textarea placeholder="Content" value={note.content} onChange={(e) => setNote({ ...note, content: e.target.value })} className="textarea textarea-bordered w-full" required/>

                        <label className="label cursor-pointer">
                            <span className="label-text">Private</span>
                            <input type="checkbox" checked={note.isPrivate} onChange={(e) => setNote({ ...note, isPrivate: e.target.checked })} className="checkbox"/>
                        </label>

                        <button className="btn" onClick={() => navigate(`/note/${id}`)}>Cancel</button>
                        <button type="submit" className="btn btn-primary w-full">Save</button>
                    </form>
                }
            </div>
        </div>
        </div>
    );
}
