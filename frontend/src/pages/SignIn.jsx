// src/pages/SignUp.jsx
import { useState } from "react";
import { signin } from "../api/authApi"; 
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

import "../index.css";


export default function SignIn() {

  const navigate = useNavigate();
  const [msg, setMsg] = useState(""); // message that will display to user
  const { login } = useContext(AuthContext);

  async function onSubmit(e) {
    e.preventDefault();

    setMsg("");
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const email = form.get("email");
    const password = form.get("password");
    if (!email || !password) return setMsg("email and password required");

    try {
      const user = await signin({ email, password }); // call to api.jsx
      login(user);
      setMsg(`Welcome ${user.name}!`);
      navigate("/dashboard");
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
    <div className="card w-96 bg-black shadow-xl rounded-2xl">
      <div className="card-body">
        <h2 className="card-title justify-center">Sign In</h2>
        <br/>
        <form className="flex flex-col gap-3" onSubmit={onSubmit}>
          <input name="email" type="email" placeholder="email" className="input input-bordered w-full"/>
          <input name="password" type="password" placeholder="password" className="input input-bordered w-full"/>
          {msg && <p className="text-sm text-center text-red-500">{msg}</p>} 
          <button type="submit" className="btn btn-primary w-full">sign in</button>
        </form>
        <p className="text-center"> <br/>New to Notepad? <Link to="/signup" className="text-blue-400 underline">Create Account</Link></p>
      </div>
    </div>
    </div>
  );
}
