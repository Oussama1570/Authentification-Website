import React from "react";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white dark:bg-gray-800 rounded shadow text-center">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">👤 Your Profile</h1>
      {user ? (
        <div className="text-gray-700 dark:text-gray-300 space-y-2">
          <p><strong>Email:</strong> {user.email}</p>
          {user.name && <p><strong>Name:</strong> {user.name}</p>}
          {user.avatar && (
            <img src={user.avatar} alt="Avatar" className="mx-auto w-20 h-20 rounded-full border" />
          )}
        </div>
      ) : (
        <p className="text-red-500">No user data available</p>
      )}
    </div>
  );
};

export default Profile;
