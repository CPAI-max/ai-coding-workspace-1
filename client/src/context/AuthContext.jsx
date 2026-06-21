import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("workspace_token")));

  useEffect(() => {
    if (!localStorage.getItem("workspace_token")) return;

    api
      .me()
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => localStorage.removeItem("workspace_token"))
      .finally(() => setLoading(false));
  }, []);

  async function authenticate(mode, payload) {
    const result = mode === "signup" ? await api.signup(payload) : await api.login(payload);
    localStorage.setItem("workspace_token", result.token);
    setUser(result.user);
  }

  function logout() {
    localStorage.removeItem("workspace_token");
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, authenticate, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
