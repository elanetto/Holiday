import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaCheckCircle } from "react-icons/fa";
import { SearchBar } from "../../SearchBar";
import logoUrl from '../../../assets/Logo.svg?url';

export function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const avatar = JSON.parse(localStorage.getItem("avatar") || "{}");

    setIsLoggedIn(!!token && avatar?.url);
    setAvatarUrl(avatar?.url || "");
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setAvatarUrl("");
    navigate("/login");
  };

  return (
    <header className="bg-creamy h-40 w-full flex justify-between items-center gap-10 p-12">
      <div>
        <Link to="/" className="text-3xl font-bold text-pink-600 hover:text-pink-800">
          <img src={logoUrl} alt="Logo for Holidaze" className="h-8" />
        </Link>
      </div>

      <div>
        <SearchBar />
      </div>

      <div className="relative">
        <nav>
          <ul className="flex gap-8 text-2xl">
            <li
              className="hover:text-orangey text-espressoy relative cursor-pointer"
              onClick={() => {
                if (isLoggedIn) setShowDropdown((prev) => !prev);
                else navigate("/login");
              }}
            >
              {isLoggedIn ? (
                <div className="relative">
                  <img
                    src={avatarUrl}
                    alt="User avatar"
                    className="w-10 h-10 rounded-full border-2 border-goldy object-cover"
                  />
                  <FaCheckCircle className="absolute -bottom-1 -right-1 text-goldy text-sm" />
                </div>
              ) : (
                <FaUser className="text-3xl" />
              )}
            </li>
          </ul>
        </nav>

        {/* Fancy dropdown */}
        {isLoggedIn && (
          <div
            className={`absolute right-0 mt-2 w-40 bg-white border border-espressoy rounded shadow-md text-sm z-50 transform transition-all duration-300 ease-out origin-top-right ${
              showDropdown
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            }`}
          >
            <Link
              to="/account"
              className="block px-4 py-2 hover:bg-creamy transition-colors"
              onClick={() => setShowDropdown(false)}
            >
              My Account
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-creamy text-error transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
