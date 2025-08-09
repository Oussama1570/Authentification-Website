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

    // one toast that keeps the same position
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

      // show toast, then go to login
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
    <form
      onSubmit={handleReset}
      className="max-w-md mx-auto mt-10 p-6 space-y-4 bg-white dark:bg-gray-800 shadow-md rounded"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
        🔑 Reset Your Password
      </h2>

      <input
        type="password"
        placeholder="New password"
        className="border p-2 w-full rounded dark:bg-gray-700 dark:text-white"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Saving..." : "Set New Password"}
      </button>
    </form>
  );
};

export default ResetPassword;
