import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const desktopLinkBase =
  "text-sm font-medium transition px-1 pb-1 border-b-2 border-transparent text-indigo-200 hover:text-white hover:border-indigo-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900";
const mobileLinkBase = "block rounded-md px-3 py-2 text-sm text-indigo-200 hover:bg-white/10";
const logoutButton =
  "inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:border-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 transition cursor-pointer";

export default function Navbar() {
  const location = useLocation();
  const { auth, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  const isActive = (path) => location.pathname === path;

  const linkClasses = (path, mobile = false) => {
    const base = mobile ? mobileLinkBase : desktopLinkBase;
    const active = mobile
      ? "bg-white/15 text-white"
      : "text-white border-white";
    return `${base} ${isActive(path) ? active : ""}`;
  };

  const renderAuthedLinks = (mobile = false) => {
    return (
      <>
        <Link
          to="/dashboard"
          onClick={mobile ? closeMenu : undefined}
          className={linkClasses("/dashboard", mobile)}
          aria-current={isActive("/dashboard") ? "page" : undefined}
        >
          Dashboard
        </Link>
        <Link
          to="/create"
          onClick={mobile ? closeMenu : undefined}
          className={linkClasses("/create", mobile)}
          aria-current={isActive("/create") ? "page" : undefined}
        >
          Create
        </Link>
      </>
    );
  };

  const renderGuestLinks = (mobile = false) => {
    if (mobile) {
      return (
        <>
          <Link
            to="/signup"
            onClick={closeMenu}
            className={linkClasses("/signup", true)}
            aria-current={isActive("/signup") ? "page" : undefined}
          >
            Sign Up
          </Link>
          <Link
            to="/signin"
            onClick={closeMenu}
            className={linkClasses("/signin", true)}
            aria-current={isActive("/signin") ? "page" : undefined}
          >
            Sign In
          </Link>
        </>
      );
    }

    return (
      <>
        <Link
          to="/signup"
          className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition ${
            isActive("/signup")
              ? "bg-white text-slate-900 shadow-sm"
              : "bg-indigo-500/90 text-white hover:bg-indigo-400/90"
          }`}
          aria-current={isActive("/signup") ? "page" : undefined}
        >
          Sign Up
        </Link>
        <Link
          to="/signin"
          className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition ${
            isActive("/signin")
              ? "text-white border border-indigo-300 bg-indigo-500/20"
              : "border border-white/20 text-white hover:bg-white/10"
          }`}
          aria-current={isActive("/signin") ? "page" : undefined}
        >
          Sign In
        </Link>
      </>
    );
  };

  return (
    <nav className="sticky top-0 z-40 bg-slate-950/95 text-white shadow-sm border-b border-white/10 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-indigo-400">Note</span>
              <span className="text-pink-400">Pad</span>
            </h1>
          </Link>

          <div className="hidden md:flex md:items-center md:space-x-6">
            {auth ? (
              <>
                <div className="flex items-center gap-5 border-r border-white/10 pr-6">
                  {renderAuthedLinks()}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-indigo-200">Hi, {auth.name}</span>
                  <button type="button" onClick={handleLogout} className={logoutButton}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9l3 3-3 3m9-3H9" />
                    </svg>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">{renderGuestLinks()}</div>
            )}
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:hidden"
            onClick={() => setIsMenuOpen(prev => !prev)}
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Toggle navigation</span>
            {isMenuOpen ? (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur">
          <div className="space-y-4 px-4 py-5">
            {auth ? (
              <>
                <div className="space-y-2">{renderAuthedLinks(true)}</div>
                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-indigo-100">
                  <p className="mb-2 font-semibold">Hi, {auth.name}</p>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={`${logoutButton} w-full justify-center`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9l3 3-3 3m9-3H9" />
                    </svg>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2">{renderGuestLinks(true)}</div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
