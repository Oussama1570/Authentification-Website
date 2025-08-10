// src/pages/ChangePassword.jsx
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Updating your password...", {
      position: "top-center",
    });

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/auth/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(res.data?.msg || "Password changed successfully ✅", {
        id: toastId,
        position: "top-center",
        duration: 1500,
      });

      setTimeout(() => navigate("/dashboard"), 200);
    } catch (err) {
      toast.error(
        err?.response?.data?.msg || err?.response?.data?.message || "Error changing password",
        { id: toastId, position: "top-center" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h1 className="h4 text-center mb-4">Change Password</h1>

              <form onSubmit={handleChange} noValidate>
                <div className="form-floating mb-3">
                  <input
                    id="currentPassword"
                    type="password"
                    className="form-control"
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    disabled={loading}
                  />
                  <label htmlFor="currentPassword">Current password</label>
                </div>

                <div className="form-floating mb-2">
                  <input
                    id="newPassword"
                    type="password"
                    className="form-control"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    disabled={loading}
                  />
                  <label htmlFor="newPassword">New password</label>
                </div>

                <div className="form-text mb-3">
                  Use at least 8 characters and avoid common words.
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Updating...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </button>
              </form>
            </div>
          </div>

          <p className="text-center mt-3 small text-muted">
            Pro tip: Use a unique passphrase you don’t use anywhere else.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
