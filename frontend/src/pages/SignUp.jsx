import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/authApi";
import { motion, AnimatePresence } from "framer-motion";
import "../index.css";


export default function SignUp() {
  const [status, setStatus] = useState("idle"); // idle | loading | success | conflict | error
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();

    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const name = form.get("name");
    const email = form.get("email");
    const password = form.get("password");

    signup(name, email, password)
      .then(response => {
        console.log("Sign-up successful:", response.data);
        setStatus("success");
        setTimeout(() => navigate("/signin"), 1500); // navigate to signin page after 1.5 secs
      })
      .catch(error => {
        console.error("Sign-up error:", error.response ? error.response.data : error.message);
        
        if (error.response && error.response.status == 409)
          setStatus("conflict")
        else
          setStatus("error") 

        setTimeout(() => setStatus("idle"), 2000); // revert to idle after 2 secs
      });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-16 md:px-12">
        <div className="grid w-full gap-12 lg:grid-cols-[1fr_420px] lg:items-center">
          <div className="hidden space-y-6 lg:block">
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">Create your account</p>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
              Keep every note close, organized, and ready
            </h1>
            <p className="text-white/80 text-lg leading-relaxed max-w-xl">
              Join NotePad to save your ideas, plans, and reminders in one trusted place. Capture thoughts quickly, then decide what to share and when.
            </p>
            <div className="hidden lg:flex gap-8 pt-4 text-sm text-white/70">
              <div>
                <p className="text-3xl font-bold text-white">Instant</p>
                <p>Start with a single note right after signing up.</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">Simple</p>
                <p>Keep lists and updates neat with zero distractions.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-black/60 border border-white/15 backdrop-blur-xl shadow-2xl p-8 sm:p-10">
            <div className="space-y-2 text-center sm:text-left">
              <h2 className="text-3xl font-semibold text-white">Sign up for NotePad</h2>
              <p className="text-sm text-white/70">Create an account to save and organize your notes.</p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={onSubmit}>
              <label className="block space-y-2 text-sm font-medium text-white/80">
                <span>Name</span>
                <input
                  name="name"
                  type="text"
                  placeholder="Your name"
                  className="input input-bordered w-full bg-white/10 text-white placeholder:text-white/40 focus:border-indigo-300 focus:outline-none"
                  required
                />
              </label>

              <label className="block space-y-2 text-sm font-medium text-white/80">
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="input input-bordered w-full bg-white/10 text-white placeholder:text-white/40 focus:border-indigo-300 focus:outline-none"
                  required
                />
              </label>

              <label className="block space-y-2 text-sm font-medium text-white/80">
                <span>Password</span>
                <input
                  name="password"
                  type="password"
                  placeholder="Create a secure password"
                  className="input input-bordered w-full bg-white/10 text-white placeholder:text-white/40 focus:border-indigo-300 focus:outline-none"
                  required
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
                      conflict: "btn-warning",
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
                    transition={{ duration: 0.15, ease: "easeInOut" }}
                  >
                    {status === "loading" ? "Signing In..."
                      : status === "success" ? "✅ Success"
                        : status === "conflict" ? "Email Taken"
                          : status === "error" ? "Unknown Error"
                            : "Create Account" // default
                    }
                  </motion.span>
                </AnimatePresence>
              </motion.button>




            </form>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 text-center sm:text-left">
              Already have an account?{" "}
              <Link to="/signin" className="font-semibold text-white hover:text-indigo-200 underline-offset-4 hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
