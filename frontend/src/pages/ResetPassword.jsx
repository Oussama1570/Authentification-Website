// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Updating password...", {
      position: "top-center",
    });

    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password },
        { withCredentials: true }
      );

      toast.success(res?.data?.msg || "Password reset successfully ✅", {
        id: toastId,
        position: "top-center",
        duration: 1500,
      });

      setTimeout(() => navigate("/login"), 200);
    } catch (err) {
      const msg =
        err?.response?.data?.msg ||
        err?.response?.data?.message ||
        "Reset failed";
      toast.error(msg, { id: toastId, position: "top-center" });
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
              <h1 className="h4 text-center mb-4">🔑 Reset Your Password</h1>

              <form onSubmit={handleReset} noValidate>
                <div className="form-floating mb-3">
                  <input
                    id="newPassword"
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    disabled={loading}
                  />
                  <label htmlFor="newPassword">New password</label>
                </div>

                <button type="submit" className="btn btn-success w-100" disabled={loading}>
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Saving...
                    </>
                  ) : (
                    "Set New Password"
                  )}
                </button>
              </form>
            </div>
          </div>

          <p className="text-center mt-3 small text-muted">
            You’ll be redirected to the login page after a successful reset.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
