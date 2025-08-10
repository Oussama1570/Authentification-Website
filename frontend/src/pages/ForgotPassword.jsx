// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Sending reset link...", {
      position: "top-center",
    });

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email },
        { withCredentials: true }
      );

      toast.success(res?.data?.msg || "Reset link sent ✅", {
        id: toastId,
        position: "top-center",
        duration: 2000,
      });
    } catch (err) {
      const msg =
        err?.response?.data?.msg ||
        err?.response?.data?.message ||
        "Something went wrong";
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
              <h1 className="h4 text-center mb-4">🔐 Forgot Password</h1>

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-floating mb-3">
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    disabled={loading}
                  />
                  <label htmlFor="email">Email address</label>
                </div>

                <div className="form-text mb-3">
                  We’ll send a password reset link to your email.
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </div>
          </div>

          <p className="text-center mt-3 small text-muted">
            Remembered your password?{" "}
            <a href="/login" className="text-decoration-none">
              Back to Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
