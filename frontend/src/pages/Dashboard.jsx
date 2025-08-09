import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...", { position: "top-center" });

    try {
      // If logout is async (e.g., server call), await it; if not, this is fine too.
      const maybePromise = logout();
      if (maybePromise?.then) await maybePromise;

      toast.success("Logged out successfully ✅", {
        id: toastId,
        position: "top-center",
        duration: 1500,
      });

      // Small delay so users see the toast before redirect
      setTimeout(() => navigate("/"), 150);
    } catch (err) {
      toast.error("Logout failed. Please try again.", {
        id: toastId,
        position: "top-center",
      });
    }
  };

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
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded transition"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
