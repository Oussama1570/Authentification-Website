import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const toastId = toast.loading("Creating your account...", {
      position: "top-center",
    });

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        { email, password },
        { withCredentials: true }
      );

      toast.success("Registration successful! ✅", {
        id: toastId,
        position: "top-center",
        duration: 1500,
      });

      setTimeout(() => navigate("/login"), 200);
    } catch (err) {
      const msg =
        err?.response?.data?.msg ||
        err?.response?.data?.message ||
        "Registration failed";
      setErrorMsg(msg);
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
              <h1 className="h4 text-center mb-4">📝 Create Your Account</h1>

              {errorMsg && (
                <div className="alert alert-danger py-2 small" role="alert">
                  {errorMsg}
                </div>
              )}

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
                  />
                  <label htmlFor="email">Email address</label>
                </div>

                <div className="form-floating mb-2">
                  <input
                    id="password"
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <div className="form-text mb-3">
                  Use at least 8 characters for a stronger password.
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary w-100">
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Creating account...
                    </>
                  ) : (
                    "Register"
                  )}
                </button>
              </form>
            </div>
          </div>

          <p className="text-center mt-3 small text-muted">
            Already have an account?{" "}
            <Link to="/login" className="text-decoration-none">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
