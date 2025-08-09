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

    // One toast that stays in place (no jump)
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
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 p-6 space-y-4 bg-white dark:bg-gray-800 shadow-md rounded"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
        🔐 Forgot Password
      </h2>

      <input
        type="email"
        placeholder="Enter your email"
        className="border p-2 w-full rounded dark:bg-gray-700 dark:text-white"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
    </form>
  );
};

export default ForgotPassword;
