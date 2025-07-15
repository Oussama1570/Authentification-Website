import React from "react";

const HomePage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
      <h1 className="text-4xl font-extrabold mb-4">Welcome to the Auth App 👋</h1>
      <p className="text-lg">Start by registering or logging in to access your dashboard.</p>
    </div>
  );
};

export default HomePage;
