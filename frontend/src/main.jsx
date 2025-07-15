import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext"; // 🔐 Global auth provider
import './index.css'; // 🎨 Tailwind styles

// 🔁 Mount root app
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* ✅ Wrap all components with global AuthContext */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
