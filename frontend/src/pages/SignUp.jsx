// src/pages/SignUp.jsx
import { useState } from "react";
import { signup } from "../api/authApi"; 
import "../index.css";

export default function SignUp() {

  const [msg, setMsg] = useState(""); // message that will display to user

  async function onSubmit(e) {
    e.preventDefault();

    setMsg("");
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const name = form.get("name");
    const email = form.get("email");
    const password = form.get("password");
    if (!name) return setMsg("name required");
    if (!email || !password) return setMsg("email and password required");

    try {
      await signup({ name, email, password }); // call to api.jsx
      setMsg("account created ✔");
      formEl.reset();
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
    <div className="card w-96 bg-black shadow-xl rounded-2xl">
      <div className="card-body">
        <h2 className="card-title justify-center">Sign Up</h2>
        <br/>
        <form className="flex flex-col gap-3" onSubmit={onSubmit}>
          <input name="name" type="name" placeholder="name" className="input input-bordered w-full"/>
          <input name="email" type="email" placeholder="email" className="input input-bordered w-full"/>
          <input name="password" type="password" placeholder="password" className="input input-bordered w-full"/>
          <button type="submit" className="btn btn-primary w-full">sign up</button>
          {msg && <p className="text-sm text-red-500">{msg}</p>} 
        </form>
      </div>
    </div>
    </div>
  );
}
