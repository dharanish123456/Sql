import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLoader from "../components/common/PageLoader";

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Wait for the session restore attempt to complete before deciding
  if (loading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Role check — normalize both sides to uppercase for comparison
  if (role) {
    const required = String(role)
      .toUpperCase()
      .replace(/^ROLE_/, "");
    const current = String(user?.role || "")
      .toUpperCase()
      .replace(/^ROLE_/, "");
    // SUPER_ADMIN and ADMIN can access admin-required routes
    const adminEquivalent = ["ADMIN", "SUPER_ADMIN", "MANAGER"];
    if (required === "ADMIN" && !adminEquivalent.includes(current)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}
