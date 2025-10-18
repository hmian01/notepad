// src/pages/SignUp.jsx
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signin } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

import "../index.css";

export default function SignIn() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle"); // idle | loading | success | conflict | error
  const { login } = useContext(AuthContext);

  async function onSubmit(e) {
    e.preventDefault();

    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const email = form.get("email");
    const password = form.get("password");

    signin(email, password)
      .then(response => {
        console.log("Sign-in successful:", response.data);
        setStatus("success");
        login(response.data); // adds to localStorage
        setTimeout(() => navigate("/dashboard"), 1000); // navigate to dashboard after 1 sec
      })
      .catch(error => {
        console.error("Sign-in error:", error.response ? error.response.data : error.message);
        
        setStatus("error")
        if (error.response)
          error.response.status == 401 ? setStatus("invalidCreds")
            : error.response.status == 404 && setStatus("accountNotFound")

        setTimeout(() => setStatus("idle"), 1500); // revert to idle after 1.5 secs
      });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-16 md:px-12">
        <div className="grid w-full gap-12 lg:grid-cols-[1fr_420px] lg:items-center">
          <div className="hidden space-y-6 lg:block">
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">Welcome back</p>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
              Pick up your notes right where you left off
            </h1>
            <p className="text-white/80 text-lg leading-relaxed max-w-xl">
              Sign in to access saved checklists, ideas, and plans. Share a note only when you need to loop someone in—everything else stays private.
            </p>
            <div className="hidden lg:flex gap-8 pt-4 text-sm text-white/70">
              <div>
                <p className="text-3xl font-bold text-white">Secure</p>
                <p>Notes stay private until you choose to share them.</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">Effortless</p>
                <p>Organize ideas without extra steps or clutter.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-black/60 border border-white/15 backdrop-blur-xl shadow-2xl p-8 sm:p-10">
            <div className="space-y-2 text-center sm:text-left">
              <h2 className="text-3xl font-semibold text-white">Sign in to NotePad</h2>
              <p className="text-sm text-white/70">Welcome back! Enter your details to continue.</p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={onSubmit}>
              <label className="block space-y-2 text-sm font-medium text-white/80">
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="input input-bordered w-full bg-white/10 text-white placeholder:text-white/40 focus:border-indigo-300 focus:outline-none"
                />
              </label>

              <label className="block space-y-2 text-sm font-medium text-white/80">
                <span>Password</span>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full bg-white/10 text-white placeholder:text-white/40 focus:border-indigo-300 focus:outline-none"
                />
              </label>

              <motion.button
                type="submit"
                disabled={status === "loading"}
                className={`btn w-full text-base font-semibold rounded-xl transition-colors duration-300
                  ${
                    {
                      idle: "btn-primary",
                      loading: "btn-secondary",
                      success: "btn-success",
                      invalidCreds: "btn-error",
                      accountNotFound: "btn-error",
                      error: "btn-error",
                    }[status]
                  }
                `}
                // animation upon click
                whileTap={{ scale: 0.95 }}
                animate={{ scale: status === "success" ? [1, 1.1, 1] : 1 }}
                >
                <AnimatePresence mode="wait">
                  <motion.span // fades the text in and out 
                    key={status}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {status === "loading" ? "Signing In..."
                      : status === "success" ? "✅ Success"
                        : status === "invalidCreds" ? "Invalid Credentials"
                          : status === "accountNotFound" ? "Account Not Found"
                            : status === "error" ? "Unknown Error"
                              : "Sign In" // default
                    }
                  </motion.span>
                </AnimatePresence>
              </motion.button>






            </form>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 text-center sm:text-left">
              New to NotePad?{" "}
              <Link to="/signup" className="font-semibold text-white hover:text-indigo-200 underline-offset-4 hover:underline">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
