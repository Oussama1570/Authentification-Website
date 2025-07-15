// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
      });
      setMessage(res.data.msg);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Something went wrong");
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
        required
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
      >
        Send Reset Link
      </button>

      {message && (
        <p className="text-sm text-center text-green-600 dark:text-green-400">
          {message}
        </p>
      )}
    </form>
  );
};

export default ForgotPassword;
