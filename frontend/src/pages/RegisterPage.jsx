import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const RegisterPage = () => {
  // 🧠 Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 📤 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    // Single toast that stays in the same position
    const toastId = toast.loading("Creating your account...", {
      position: "top-center",
    });

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        { email, password },
        { withCredentials: true } // ok if your API sets cookies; harmless otherwise
      );

      toast.success("Registration successful! ✅", {
        id: toastId,
        position: "top-center",
        duration: 1500,
      });

      // Let the toast render, then redirect
      setTimeout(() => navigate("/login"), 200);
    } catch (err) {
      const msg =
        err?.response?.data?.msg ||
        err?.response?.data?.message ||
        "Registration failed";
      setErrorMsg(msg);

      toast.error(msg, {
        id: toastId,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 space-y-5 bg-white dark:bg-gray-800 p-6 shadow-md rounded"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
        📝 Create Your Account
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
        className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Creating account..." : "Register"}
      </button>

      <p className="text-sm text-center text-gray-600 dark:text-gray-400">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400">
          Login here
        </Link>
      </p>
    </form>
  );
};

export default RegisterPage;
