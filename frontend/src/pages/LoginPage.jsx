import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  if (!auth) return null;

  const { login, setUser } = auth;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    const toastId = toast.loading("Signing you in...", { position: "top-center" });

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      login(res.data.accessToken);
      if (res.data.user) setUser(res.data.user);

      toast.success("Welcome back! ✅", { id: toastId, position: "top-center", duration: 1500 });
      setTimeout(() => navigate("/dashboard"), 150);
    } catch (err) {
      const msg = err?.response?.data?.msg || err?.response?.data?.message || "Login failed";
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
              <h1 className="h4 text-center mb-4">🔐 Login to Your Account</h1>

              {errorMsg && (
                <div className="alert alert-danger py-2 small" role="alert">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleLogin} noValidate>
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

                <div className="form-floating mb-3">
                  <input
                    id="password"
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>

                <div className="d-flex justify-content-end mb-3">
                  <Link to="/forgot-password" className="small text-decoration-none">
                    Forgot your password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-success w-100"
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Signing in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
            </div>
          </div>

          <p className="text-center mt-3 small text-muted">
            Don’t have an account?{" "}
            <Link to="/register" className="text-decoration-none">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
