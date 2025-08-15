import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../utils/cookieUtils";

const ProtectedRoute = () => {
  const authenticated = isAuthenticated();

  return authenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
