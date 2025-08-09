import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const auth = useAuth(); // 🔐 Access auth context
  const navigate = useNavigate();

  if (!auth) return null;

  const { login } = auth;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  // 📤 Handle form submission
  const handleLogin = async (e) => {
  e.preventDefault();
  setErrorMsg(null);
  setLoading(true);

  // Show loading toast at top-center
  const toastId = toast.loading("Signing you in...", { position: "top-center" });

  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      { email, password },
      { withCredentials: true }
    );

    login(res.data.accessToken);

    // Update existing toast to success (same position)
    toast.success("Welcome back! ✅", {
      id: toastId,
      position: "top-center",
      duration: 1500,
    });

    // Wait a moment for toast to display before navigating
    setTimeout(() => navigate("/dashboard"), 150);
  } catch (err) {
    console.error("Login error:", err);
    setErrorMsg(
      err?.response?.data?.msg ||
        err?.response?.data?.message ||
        "Login failed"
    );

    // Update existing toast to error (same position)
    toast.error(
      err?.response?.data?.msg ||
        err?.response?.data?.message ||
        "Login failed. Please try again.",
      { id: toastId, position: "top-center" }
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-md mx-auto mt-10 space-y-5 bg-white dark:bg-gray-800 p-6 shadow-md rounded"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
        🔐 Login to Your Account
      </h2>

      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full rounded dark:bg-gray-700 dark:text-white"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full rounded dark:bg-gray-700 dark:text-white"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        required
      />

      {errorMsg && (
        <p className="text-sm text-red-600 text-center">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        {loading ? "Signing in..." : "Login"}
      </button>

      <div className="text-right">
        <Link
          to="/forgot-password"
          className="text-sm text-blue-600 hover:underline"
        >
          Forgot your password?
        </Link>
      </div>
    </form>
  );
};

export default LoginPage;
