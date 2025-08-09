import React from "react";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9998] grid place-items-center bg-white/70 dark:bg-black/40 backdrop-blur-sm">
      {/* simple Tailwind spinner */}
      <div className="h-10 w-10 rounded-full border-4 border-gray-300 dark:border-gray-600 border-t-gray-700 dark:border-t-white animate-spin" />
    </div>
  );
};

export default PageLoader;
