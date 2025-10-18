
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../index.css";

const features = [
  {
    title: "Secure note storage",
    description: "Keep every draft protected in your private workspace so nothing gets lost in shared folders.",
  },
  {
    title: "Instant shareable links",
    description: "Flip a note public in a click, ship the link, and keep the original safely editable in your dashboard.",
  },
  {
    title: "Start without an account",
    description: "Capture your first idea in seconds, then create an account only when you are ready to save it to the cloud.",
  },
];

export default function Home() {
  const { auth } = useContext(AuthContext);
  const primaryCta = auth ? "/dashboard" : "/signup";
  const secondaryCta = auth ? "/create" : "/signin";
  const primaryLabel = auth ? "Open dashboard" : "Create free account";
  const secondaryLabel = auth ? "New note" : "Sign in";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-20 flex flex-col lg:flex-row items-center gap-12">
        <div className="w-full lg:w-1/2 space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">Share notes instantly</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Welcome to Notepad
          </h1>
          <p className="text-white/80 text-lg leading-relaxed">
            Capture ideas the moment they strike. Keep them safe in your private space or share them instantly with a secure link.
            From project plans to personal notes, snippets of code to daily reflections — Notepad keeps everything safe, organized, and ready whenever you are.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={primaryCta} className="btn btn-primary px-8 py-3 text-base font-semibold">
              {primaryLabel}
            </Link>
            <Link to={secondaryCta} className="btn btn-outline border-white/60 text-white hover:bg-white/10 px-8 py-3 text-base font-semibold">
              {secondaryLabel}
            </Link>
          </div>
          <div className="flex gap-8 pt-4">
            <div>
              <p className="text-3xl font-bold">Secure</p>
              <p className="text-sm text-white/80">Private workspace for drafts and reminders</p>
            </div>
            <div>
              <p className="text-3xl font-bold">Link-Ready</p>
              <p className="text-sm text-white/80">Share Instantly via secure public URLs, remove public access at anytime</p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <div className="bg-black/50 border border-white/15 rounded-3xl shadow-2xl backdrop-blur-sm p-8 max-w-lg mx-auto">
            <div className="flex items-center justify-between text-xs text-white/70 mb-6">
              <span>Today</span>
              <span>Private</span>
            </div>
            <h3 className="text-2xl text-center font-semibold mb-4">Daily plan: morning checklist</h3>
            <div className="space-y-4 bg-white/5 rounded-2xl p-5">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/60 mb-1">Focus</p>
                <p className="text-sm leading-relaxed text-white/90">
                  Keep mornings on track with quick reminders you can check off as you go.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-white/60 mb-1">Next steps</p>
                <ul className="space-y-2 text-sm text-white/90">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true"></span>
                    Brew coffee and review today’s priorities
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-violet-300" aria-hidden="true"></span>
                    Send quick update message to the team
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-sky-300" aria-hidden="true"></span>
                    Pack lunch and set reminder for afternoon walk
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 md:px-12 pb-16 space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Everything you need to stay in flow</h2>
          <p className="text-white/80 max-w-3xl mx-auto text-lg">
            NotePad pairs a lightweight editor with a clear dashboard so your notes move from first draft to finished thought
            without extra steps.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map(feature => (
            <div key={feature.title} className="bg-black/45 border border-white/10 rounded-2xl p-6 shadow-lg hover:-translate-y-1 hover:shadow-2xl transition">
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-sm text-white/80 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 md:px-12 pb-24">
        <div className="bg-black/60 border border-white/10 rounded-3xl p-10 text-center space-y-6 shadow-2xl">
          <h3 className="text-2xl font-semibold">Ready to capture your next idea?</h3>
          <p className="text-white/80 text-lg">
            Start with a single note and grow into a focused workspace. Your future self will thank you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link to={primaryCta} className="btn btn-primary px-8 py-3 text-base font-semibold">
              {primaryLabel}
            </Link>
            <Link to={secondaryCta} className="btn btn-outline border-white/60 text-white hover:bg-white/10 px-8 py-3 text-base font-semibold">
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
