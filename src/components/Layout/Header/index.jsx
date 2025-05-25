import { useMemo, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import logoYellow from "../../../assets/SVG/logo_yellow.svg?url";
import logoOrange from "../../../assets/SVG/logo_orange.svg?url";
import { useUser } from "../../../contexts/useUser";
import { PLACEHOLDER_AVATAR } from "../../../utilities/placeholders";
import { FaUser, FaCheckCircle, FaSearch } from "react-icons/fa";

export function Header() {
  const { isLoggedIn, avatar, logoutUser, user } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [logoSrc, setLogoSrc] = useState(logoYellow);

  const userName = useMemo(() => {
    return user?.name || localStorage.getItem("name");
  }, [user]);

  const handleLogout = () => {
    logoutUser();
  };

  const renderUserIcon = () => {
    const avatarUrl = avatar || PLACEHOLDER_AVATAR;
    return isLoggedIn ? (
      <div className="relative hover:brightness-90 transition">
        <img
          src={avatarUrl}
          alt="User avatar"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-check object-cover cursor-pointer"
        />
        <FaCheckCircle className="absolute -bottom-1 -right-1 text-check text-sm" />
      </div>
    ) : (
      <FaUser className="text-2xl sm:text-3xl text-sunny hover:text-orangey" />
    );
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => (window.location.href = "/")}
          onMouseEnter={() => setLogoSrc(logoOrange)}
          onMouseLeave={() => setLogoSrc(logoYellow)}
          className="focus:outline-none cursor-pointer transition"
        >
          <img src={logoSrc} alt="Logo for Holidaze" className="h-5 sm:h-7" />
        </button>

        {/* User section: Search icon + Avatar + Dropdown */}
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          {/* 🔍 Search Icon */}
          <Link
            to="/search"
            className="text-xl cursor-pointer sm:text-2xl text-sunny hover:text-orangey transition"
            aria-label="Go to search page"
          >
            <FaSearch />
          </Link>

          {/* 👤 Avatar */}
          {isLoggedIn ? (
            <div
              onClick={() => setShowDropdown((prev) => !prev)}
              className="cursor-pointer"
            >
              {renderUserIcon()}
            </div>
          ) : (
            <Link to="/login" className="cursor-pointer">
              {renderUserIcon()}
            </Link>
          )}

          {/* Dropdown Menu */}
          {isLoggedIn && (
            <div
              className={`absolute right-0 top-12 sm:top-14 w-40 bg-white border border-espressoy rounded shadow-md text-sm z-[10000]
              transform transition-all duration-300 ease-out origin-top-right cursor-pointer ${
                showDropdown
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }`}
            >
              <Link
                to={`/account/${encodeURIComponent(userName)}`}
                className="block px-4 py-2 hover:bg-creamy transition-colors cursor-pointer"
                onClick={() => setShowDropdown(false)}
              >
                My Account
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-creamy text-error transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
