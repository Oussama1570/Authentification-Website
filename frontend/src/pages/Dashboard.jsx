import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white dark:bg-gray-800 rounded shadow text-center">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
  👋 Welcome to your Dashboard!
</h1>

      {user && (
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Logged in as: <span className="font-medium">{user.email}</span>
        </p>
      )}

      <div className="flex flex-col gap-4 items-center mt-6">
        <button
          onClick={() => navigate("/change-password")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition"
        >
          🔑 Change Password
        </button>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded transition"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
