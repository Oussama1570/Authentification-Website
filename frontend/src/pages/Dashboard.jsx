// src/pages/Dashboard.jsx
import React, { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const avatarUrl = useMemo(() => {
    if (user?.avatarUrl) return user.avatarUrl;
    const name = user?.name || user?.email || "U";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=0D6EFD&color=fff`;
  }, [user]);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    const toastId = toast.loading("Logging out...", { position: "top-center" });

    try {
      const maybePromise = logout();
      if (maybePromise?.then) await maybePromise;

      toast.success("Logged out successfully ✅", {
        id: toastId,
        position: "top-center",
        duration: 1500,
      });
      setTimeout(() => navigate("/"), 150);
    } catch {
      toast.error("Logout failed. Please try again.", {
        id: toastId,
        position: "top-center",
      });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body p-4 text-center">
              <h1 className="h4 mb-3">👋 Welcome to your Dashboard!</h1>

              {user && (
                <>
                  {/* Centered avatar */}
                  <div className="d-flex justify-content-center mb-3">
                    <img
                      src={avatarUrl}
                      alt="avatar"
                      width="96"
                      height="96"
                      className="rounded-circle border d-block"
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  <p className="text-muted mb-4">
                    Logged in as <span className="fw-semibold">{user.email}</span>
                  </p>
                </>
              )}

              <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="btn btn-outline-primary"
                >
                  👤 Profile
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/change-password")}
                  className="btn btn-primary"
                >
                  🔑 Change Password
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-outline-danger"
                  disabled={loggingOut}
                >
                  {loggingOut ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Logging out...
                    </>
                  ) : (
                    "🚪 Logout"
                  )}
                </button>
              </div>
            </div>
          </div>

          <p className="text-center small text-muted mt-3">
            Tip: You can update your avatar on the Profile page.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
