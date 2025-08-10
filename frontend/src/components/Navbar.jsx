import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useMemo, useState } from "react";

const Navbar = () => {
  const auth = useAuth();
  if (!auth) return null;

  const { user, logout } = auth;

  // Bootstrap color mode via data-bs-theme
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme-bs");
    if (saved) return saved === "dark";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  });

  useEffect(() => {
    const theme = isDark ? "dark" : "light";
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme-bs", theme);
  }, [isDark]);

  const toggleDark = () => setIsDark((d) => !d);

  // Avatar (fallback to initials)
  const avatarUrl = useMemo(() => {
    if (user?.avatarUrl) return user.avatarUrl;
    const name = user?.name || user?.email || "U";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=0D6EFD&color=fff`;
  }, [user]);

  return (
    <nav className="navbar navbar-expand-lg bg-body shadow-sm sticky-top" style={{ backdropFilter: "saturate(120%) blur(6px)" }}>
      <div className="container">
        {/* Brand */}
        <Link to="/" className="navbar-brand fw-bold d-flex align-items-center">
          <span className="me-1">🛡</span> AuthApp
        </Link>

        {/* Right controls (always visible) */}
        <div className="d-flex align-items-center order-lg-2">
          {/* Theme toggle */}
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm me-2"
            title="Toggle theme"
            onClick={toggleDark}
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          {/* Auth actions */}
          {!user ? (
            <div className="d-flex gap-2">
              <Link className="btn btn-outline-primary btn-sm" to="/login">
                Login
              </Link>
              <Link className="btn btn-primary btn-sm" to="/register">
                Register
              </Link>
            </div>
          ) : (
            <div className="dropdown">
              <button
                className="btn btn-link dropdown-toggle d-flex align-items-center text-decoration-none"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={avatarUrl}
                  alt="avatar"
                  width="34"
                  height="34"
                  className="rounded-circle border me-2"
                  style={{ objectFit: "cover" }}
                />
                <span className="d-none d-sm-inline">{user?.email}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end p-0 overflow-hidden">
                {/* header */}
                <li className="px-3 py-2 small text-muted">
                  <div className="fw-semibold">{user?.email}</div>
                  <div className="text-muted">{user?.email}</div>
                </li>
                <li><hr className="dropdown-divider m-0" /></li>
                <li><Link className="dropdown-item py-2" to="/profile">Profile</Link></li>
                <li><Link className="dropdown-item py-2" to="/dashboard">Dashboard</Link></li>
                <li><Link className="dropdown-item py-2" to="/change-password">Change Password</Link></li>
                <li><hr className="dropdown-divider m-0" /></li>
                <li>
                  <button className="dropdown-item text-danger py-2" onClick={logout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* Mobile toggler (kept at far right) */}
          <button
            className="navbar-toggler ms-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
        </div>

        {/* Left/center links (collapsible) */}
        <div className="collapse navbar-collapse order-lg-1" id="mainNavbar">
          <ul className="navbar-nav mx-lg-auto mb-2 mb-lg-0 mt-3 mt-lg-0 gap-lg-2">
            <li className="nav-item">
              <NavLink end to="/" className={({ isActive }) => "nav-link" + (isActive ? " active fw-semibold" : "")}>
                Home
              </NavLink>
            </li>

            {user && (
              <li className="nav-item">
                <NavLink to="/dashboard" className={({ isActive }) => "nav-link" + (isActive ? " active fw-semibold" : "")}>
                  Dashboard
                </NavLink>
              </li>
            )}

            {user?.email === "admin@example.com" && (
              <li className="nav-item">
                <NavLink to="/admin" className={({ isActive }) => "nav-link" + (isActive ? " active fw-semibold" : "")}>
                  Admin
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
