import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/useUser";

export default function PrivateRoute({ children }) {
  const { isLoggedIn, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return <div className="p-8 text-center">Checking login status...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
