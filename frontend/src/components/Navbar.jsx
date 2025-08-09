import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import ProfileMenu from "./ProfileMenu";

const Navbar = () => {
  const auth = useAuth();
  if (!auth) return null;

  const { user } = auth;

  // 🌙 Dark mode (persisted)
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleDark = () => setIsDark((d) => !d);

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white shadow">
      {/* 🔗 Logo */}
      <Link to="/" className="text-xl font-bold">
        🛡 AuthApp
      </Link>

      {/* 🔗 Right-side nav */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>

            {/* 🛡 Optional: Admin-only link */}
            {user.email === "admin@example.com" && (
              <Link to="/admin" className="hover:underline">
                Admin
              </Link>
            )}

            {/* 👤 Avatar + dropdown */}
            <ProfileMenu />
          </>
        ) : (
          <>
            <Link
              className="hover:text-blue-600 dark:hover:text-blue-300 font-medium"
              to="/login"
            >
              Login
            </Link>
            <Link
              className="hover:text-blue-600 dark:hover:text-blue-300 font-medium"
              to="/register"
            >
              Register
            </Link>
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
