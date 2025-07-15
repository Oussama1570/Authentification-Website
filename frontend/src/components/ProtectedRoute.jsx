import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// 🔒 Wrapper to protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  // ✅ If logged in → render component, else → redirect to login
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
