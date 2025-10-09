import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();


// Notes: eventually I want the auth info to be transfered from localStorage to Http-only cookies
 
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);

  // load auth data from localStorage on page load and save to context
  useEffect(() => {
    const savedAuth = JSON.parse(localStorage.getItem("auth"));
    if (savedAuth) 
      setAuth(savedAuth);
  }, []);

  // for login and logout, update both context and localStorage
  const login = (authData) => {
    localStorage.setItem("auth", JSON.stringify(authData));
    setAuth(authData);
  };
  
  const logout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
