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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Create a New Note</h2>
          {msg && <p className="text-red-500">{msg}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <input type="text" placeholder="Title" value={title} onChange={
                    (e) => setTitle(e.target.value)
                } className="input input-bordered w-full" required/>
            <textarea placeholder="Content" value={content} onChange={
                    (e) => setContent(e.target.value)
                } className="textarea textarea-bordered w-full" required/>
            <label className="label cursor-pointer">
              <span className="label-text">Private</span>
              <input type="checkbox" checked={isPrivate} onChange={() => setIsPrivate(!isPrivate)} className="checkbox"/>
            </label>
            <button type="submit" className="btn btn-primary w-full">Create Note</button>

          </form>
        </div>
      </div>
    </div>
  );
}
