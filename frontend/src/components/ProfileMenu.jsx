import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const ProfileMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);
  const menuId = "profile-menu";

  // If not logged in, don't render
  if (!user) return null;

  // Avatar initial (after user check)
  const initial =
    user?.name?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "U";

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...", { position: "top-center" });
    try {
      const maybePromise = logout();
      if (maybePromise?.then) await maybePromise;

      toast.success("Logged out successfully ✅", {
        id: toastId,
        position: "top-center",
        duration: 1500,
      });

      setOpen(false);
      setTimeout(() => navigate("/"), 150);
    } catch {
      toast.error("Logout failed. Please try again.", {
        id: toastId,
        position: "top-center",
      });
    }
  };

  // Close on click outside & Esc
  useEffect(() => {
    const onClick = (e) => {
      if (
        !menuRef.current ||
        !btnRef.current ||
        menuRef.current.contains(e.target) ||
        btnRef.current.contains(e.target)
      ) {
        return;
      }
      setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Close when the route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        {/* Avatar (image if available, otherwise initial) */}
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="avatar"
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
            {initial}
          </div>
        )}
        <span id={`${menuId}-label`} className="hidden sm:block text-sm text-gray-700 dark:text-gray-200">
          {user?.name || user?.email}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 11.94 1.16l-4.24 3.36a.75.75 0 01-.94 0L5.21 8.39a.75.75 0 01.02-1.18z" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          id={menuId}
          ref={menuRef}
          role="menu"
          aria-labelledby={`${menuId}-label`}
          className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg p-1 z-[100]"
        >
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
              {user?.name || user?.email}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
          <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />

          {/* Order: Profile, Dashboard, Change Password */}
          <Link
            to="/profile"
            className="block px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>

          <Link
            to="/dashboard"
            className="block px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>

          <Link
            to="/change-password"
            className="block px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Change Password
          </Link>

          <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />

          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            role="menuitem"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
