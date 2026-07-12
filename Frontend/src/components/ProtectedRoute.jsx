import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const ProctedRoutes = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // avoid flashing a redirect while localStorage is being read

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

export default ProctedRoutes;
