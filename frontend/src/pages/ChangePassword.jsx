import React, { useState } from "react";
import axios from "axios";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/auth/change-password", {
        currentPassword,
        newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(res.data.msg);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error changing password");
    }
  };

  return (
    <form onSubmit={handleChange} className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold text-center">Change Password</h2>

      <input
        type="password"
        placeholder="Current password"
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="New password"
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <button className="w-full bg-blue-600 text-white p-2 rounded">
        Change Password
      </button>
      {message && <p className="text-center text-green-600">{message}</p>}
    </form>
  );
};

export default ChangePassword;
