import { createContext, useContext, useState, useEffect } from "react";

// 🧠 Create global context
const AuthContext = createContext(null);

// 🔐 Provides auth state and actions
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  // 🔁 Fetch current user when token changes
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => setUser(null));
  }, [token]);

  // ✅ Save token + trigger user fetch
  const login = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  // 🔓 Clear session
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 📥 Easy access hook
export const useAuth = () => useContext(AuthContext);
