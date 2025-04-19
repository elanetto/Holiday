import { useNavigate } from "react-router-dom";

export function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("avatar");
    localStorage.removeItem("isAdmin");

    navigate("/login");
    window.location.reload();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-espressoy hover:text-orangey transition-colors px-3 py-1"
    >
      Logout
    </button>
  );
}
