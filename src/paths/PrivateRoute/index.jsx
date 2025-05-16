import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/useUser";

export default function PrivateRoute({ children }) {
  const { isLoggedIn } = useUser();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
