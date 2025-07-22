import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  // 🔁 Fetch user on token change
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          console.error("❌ Failed to fetch user:", data.msg);
        }
      })
      .catch((err) => {
        console.error("❌ Failed to fetch user:", err.message);
        setUser(null);
      });
  }, [token]);

  // 🔁 Refresh token every 14 min
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/auth/refresh",
          {},
          { withCredentials: true }
        );
        const newAccessToken = res.data.accessToken;
        localStorage.setItem("token", newAccessToken);
        setToken(newAccessToken);
      } catch (err) {
        console.error("🔁 Token refresh failed:", err.message);
        setUser(null);
        setToken(null);
      }
    }, 14 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Login
  const login = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  // Logout
  const logout = async () => {
    await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
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

export const useAuth = () => useContext(AuthContext);
