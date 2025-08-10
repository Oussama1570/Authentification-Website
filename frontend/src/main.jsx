import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";



ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />

      {/* Global toast host */}
      <Toaster
  position="top-center"
  gutter={8}
  containerStyle={{ zIndex: 999999 }}   // <— very high
  toastOptions={{
    duration: 3000,
    style: { borderRadius: "10px", padding: "10px 12px" },
    success: { duration: 2000 },
    error: { duration: 4000 },
  }}
/>

    </AuthProvider>
  </React.StrictMode>
);

