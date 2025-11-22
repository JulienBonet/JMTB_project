import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth() {
  const { isAuthenticated } = useAuth();

  // Si pas connecté → redirection vers /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Sinon → rendu normal
  return <Outlet />;
}
