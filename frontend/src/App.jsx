import { BrowserRouter, Routes, Route } from "react-router-dom";

// 📄 Page components
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import HomePage from "./pages/HomePage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword"; // ✅ NEW

// 🔒 Protected route wrapper
import ProtectedRoute from "./components/ProtectedRoute";

// 📌 Navbar (always visible)
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <BrowserRouter>
      {/* 🔝 Always show Navbar */}
      <Navbar />

      {/* 📍 App Routes */}
      <Routes>
        {/* 🏠 Public Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* 🔐 Protected Pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔑 Change Password (Private) */}
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;



// https://chatgpt.com/c/682a4809-d4f4-8003-b832-5fb5cc286587

// Optional Enhancements (Just Ask)
// Would you like to add:

// ✅ Toast notifications?

// ✅ A loading spinner on submit?

// ✅ Beautiful animated transitions (like fade-in or slide)?

// ✅ Avatar + profile dropdown?


 // Enable refresh token authentication
 // Or set up admin-only routes

//1. Refresh Token System (Advanced Security)
// Keeps users logged in even after token expiration.

// Uses:

// Access token (short-lived) + Refresh token (stored in httpOnly cookie).

// Requires backend changes: /refresh, /logout, secure cookie setup.

// Frontend auto-renews token silently.

// ✅ Ideal if your app will stay logged in for a long time.

// ✉️ 2. Password Reset via Email
// Flow:

// User clicks “Forgot Password?”

// Enters email → gets reset link by email.

// Link opens a page to enter new password.

// Requires:

// Backend email service (like Gmail SMTP or SendGrid)

// Secure token generation (JWT or UUID)

// A reset password page in frontend

// ✅ Great for production apps or real user accounts.

// 🔐 3. Admin-Only Route + Admin Dashboard
// Only users with a specific email or role (like admin@example.com) can access /admin.

// Shows an admin dashboard with:

// All users

//Stats

// Custom admin actions (e.g., delete users)

// ✅ Useful if you're building a full dashboard with roles.

// add gitignore to hide .env backend and frontend