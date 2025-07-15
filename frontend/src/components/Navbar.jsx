import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const Navbar = () => {
  const auth = useAuth(); // ✅ Get auth context

  if (!auth) return null; // ❌ Prevent rendering before context is ready

  const { user, logout } = auth;
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  // 🌙 Toggle dark mode
  const toggleDark = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  // 🔁 Keep HTML class in sync
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // 🔓 Logout action
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white shadow">
      {/* 🔗 Logo */}
      <Link to="/" className="text-xl font-bold">🛡 AuthApp</Link>

      {/* 🔗 Right-side nav */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>

            {/* 🛡 Optional: Admin-only link */}
            {user.email === "admin@example.com" && (
              <Link to="/admin" className="hover:underline">Admin</Link>
            )}

            <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-300 font-medium">Login</Link>
<Link to="/register" className="hover:text-blue-600 dark:hover:text-blue-300 font-medium">Register</Link>

          </>
        )}

        {/* 🌙 Dark mode toggle */}
        <button onClick={toggleDark} className="ml-2 border px-2 py-1 rounded">
          {isDark ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
