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

      toast.success(res.data.msg || "Password changed successfully ✅", {
        id: toastId,
        position: "top-center",
        duration: 1500,
      });

      // Small delay to show toast before redirecting
      setTimeout(() => navigate("/dashboard"), 200);
    } catch (err) {
      toast.error(
        err?.response?.data?.msg || "Error changing password",
        { id: toastId, position: "top-center" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleChange}
      className="max-w-md mx-auto mt-10 space-y-4 bg-white dark:bg-gray-800 p-6 shadow-md rounded"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
        Change Password
      </h2>

      <input
        type="password"
        placeholder="Current password"
        onChange={(e) => setCurrentPassword(e.target.value)}
        value={currentPassword}
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        required
      />

      <input
        type="password"
        placeholder="New password"
        onChange={(e) => setNewPassword(e.target.value)}
        value={newPassword}
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        required
      />

      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? "Updating..." : "Change Password"}
      </button>
    </form>
  );
};

export default ChangePassword;
