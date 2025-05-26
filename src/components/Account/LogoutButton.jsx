import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/useUser";

export function LogoutButton() {
  const navigate = useNavigate();
  const { logoutUser } = useUser();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full text-left px-4 py-2 hover:bg-creamy text-error transition-colors"
    >
      Logout
    </button>
  );
}
