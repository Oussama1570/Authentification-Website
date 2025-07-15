// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, {
        password,
      });
      setMessage(res.data.msg);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Reset failed");
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
        required
      />

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700"
      >
        Set New Password
      </button>

      {message && (
        <p className="text-sm text-center text-blue-600 dark:text-blue-400">
          {message}
        </p>
      )}
    </form>
  );
};

export default ResetPassword;
