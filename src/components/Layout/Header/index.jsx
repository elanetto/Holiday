import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaCheckCircle } from "react-icons/fa";
import { SearchBar } from "../../SearchBar";
import logoUrl from "../../../assets/Logo.svg?url";
import { useUser } from "../../../contexts/useUser";
import { PLACEHOLDER_AVATAR } from "../../../utilities/placeholders";

export function Header() {
  const { isLoggedIn, avatar, logoutUser, user } = useUser();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const renderUserIcon = () => {
    const avatarUrl = avatar || PLACEHOLDER_AVATAR;
    return isLoggedIn ? (
      <div className="relative hover:brightness-90 transition">
        <img
          src={avatarUrl}
          alt="User avatar"
          className="w-12 h-12 rounded-full border-2 border-check object-cover"
        />
        <FaCheckCircle className="absolute -bottom-1 -right-1 text-check text-sm" />
      </div>
    ) : (
      <FaUser className="text-3xl" />
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userName = user?.name;

  return (
    <header className="bg-creamy h-40 w-full flex justify-between items-center gap-10 p-12">
      {/* Logo */}
      <div>
        <Link
          to="/"
          className="text-3xl font-bold text-pink-600 hover:text-pink-800"
        >
          <img src={logoUrl} alt="Logo for Holidaze" className="h-8" />
        </Link>
      </div>

      {/* Search */}
      <div>
        <SearchBar />
      </div>

      {/* User Avatar or Icon */}
      <div className="relative" ref={dropdownRef}>
        <nav>
          <ul className="flex gap-8 text-2xl">
            <li
              className="hover:text-orangey text-espressoy relative cursor-pointer"
              onClick={() => {
                if (isLoggedIn) {
                  setShowDropdown((prev) => !prev);
                } else {
                  navigate("/login");
                }
              }}
            >
              {renderUserIcon()}
            </li>
          </ul>
        </nav>

        {/* Dropdown */}
        {isLoggedIn && (
          <div
            className={`absolute right-0 mt-2 w-40 bg-white border border-espressoy rounded shadow-md text-sm z-50 transform transition-all duration-300 ease-out origin-top-right ${
              showDropdown
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            }`}
          >
            <Link
              to={`/account/${userName}`}
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
