import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();


// Notes: eventually I want the auth info to be transfered from localStorage to Http-only cookies
 
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const navigate = useNavigate();

  // load auth data from localStorage on page load and save to context
  useEffect(() => {
    const savedAuth = JSON.parse(localStorage.getItem("auth"));
    if (savedAuth) 
      setAuth(savedAuth);
  }, []);

  useEffect(() => {
    if (!auth || !auth.expiresAt) return;

    const now = Date.now();
    const expirationTime = new Date(auth.expiresAt).getTime();
    const timeLeft = expirationTime - now;

    if (timeLeft <= 0) { // token already expired
      logout();
      return;
    }

    const timer = setTimeout(() => {
      logout();
    }, timeLeft);

    return () => clearTimeout(timer);
  }, [auth]);

  // for login and logout, update both context and localStorage
  const login = (authData) => {
    localStorage.setItem("auth", JSON.stringify(authData));
    setAuth(authData);
  };
  
  const logout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
