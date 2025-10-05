import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { addNote } from "../api/notesApi";
import { useNavigate } from "react-router-dom";

export default function Create() {
  const { user } = useContext(AuthContext); // logged in user
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    try {
      const newNote = await addNote(user.id, {
        title,
        content,
        isPrivate,
      });
      console.log("Created note:", newNote);
      navigate("/dashboard"); // go back after creating
    } catch (err) {
      setMsg(err.message);
    }
  }

  if (!user) return <p>Please sign in to create notes.</p>;

  return (
      <div className="min-h-screen flex items-start justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-15">
      <div className="card w-full max-w-xl bg-base-100 shadow-xl">
        <div className="card-body">
            <h1 className="card-title text-2xl justify-center mb-6">Create Note</h1>
          {msg && <p className="text-red-500">{msg}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col">

            <label className="block mb-2 text-lg font-semibold">Title</label>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="input input-bordered w-full mb-4" required/>

            <label className="block mb-2 text-lg font-semibold">Content</label>
            <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} className="textarea textarea-bordered w-full h-40 mb-4"/>

            <label className="label cursor-pointer">
              <span className="label-text">Private</span>
              <input type="checkbox" checked={isPrivate} onChange={() => setIsPrivate(!isPrivate)} className="checkbox checkbox-primary"/>
            </label>

            <button type="submit" className="btn btn-primary w-full mt-6">Create Note</button>

          </form>
        </div>
      </div>
    </div>
  );
}
