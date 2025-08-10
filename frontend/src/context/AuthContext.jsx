import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

// Adjust if you have a getBaseUrl() helper
const API_URL = "http://localhost:5000";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);

  // Keep axios Authorization header in sync with token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Fetch current user (used on token change and on demand)
  const refreshUser = async () => {
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const { data } = await axios.get(`${API_URL}/api/auth/me`, {
        withCredentials: true,
      });
      if (data?.user) {
        setUser(data.user);
      } else {
        console.error("❌ Failed to fetch user:", data?.msg || "Unknown error");
        setUser(null);
      }
    } catch (err) {
      console.error("❌ Failed to fetch user:", err.message);
      setUser(null);
    }
  };

  // 🔁 Fetch user whenever token changes
  useEffect(() => {
    if (!token) return;
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // 🔁 Refresh access token every 14 min
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.post(
          `${API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const newAccessToken = res.data?.accessToken;
        if (newAccessToken) {
          localStorage.setItem("token", newAccessToken);
          setToken(newAccessToken);
        }
      } catch (err) {
        console.error("🔁 Token refresh failed:", err.message);
        localStorage.removeItem("token");
        setUser(null);
        setToken("");
      }
    }, 14 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Login
  const login = (newToken, userPayload) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    if (userPayload) setUser(userPayload); // optional immediate set if you return user on login
  };

  // Logout
  const logout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
    } catch (_) {}
    localStorage.removeItem("token");
    setUser(null);
    setToken("");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,           // ⬅️ expose for avatar updates
        token,             // keeping original for backward compat
        accessToken: token, // ⬅️ clearer name for new code
        login,
        logout,
        refreshUser,       // ⬅️ handy to re-pull /me after profile changes
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
