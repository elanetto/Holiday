import { useMemo, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaCheckCircle, FaSearch } from "react-icons/fa";
import { SearchBar } from "../../SearchBar";
import MobileSearchBar from "../../SearchBar/MobileSearchBar/index";
import logoUrl from "../../../assets/Logo_hvit.svg?url";
import { useUser } from "../../../contexts/useUser";
import { PLACEHOLDER_AVATAR } from "../../../utilities/placeholders";
import { useLocation } from "react-router-dom";
import backgroundimage from "../../../assets/background/travel_street.png";

export function Header() {
  const { isLoggedIn, avatar, logoutUser, user } = useUser();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
  };

  const userName = useMemo(() => {
    return user?.name || localStorage.getItem("name");
  }, [user]);

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
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-check object-cover cursor-pointer"
        />
        <FaCheckCircle className="absolute -bottom-1 -right-1 text-check text-sm" />
      </div>
    ) : (
      <FaUser className="text-2xl sm:text-3xl" />
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
    <>
      <header 
        style={{
          backgroundImage: `url(${backgroundimage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      className="bg-creamy w-full px-4 py-4 sm:px-8 sm:py-6 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={handleLogoClick}
          className="focus:outline-none cursor-pointer"
        >
          <img
            src={logoUrl}
            alt="Logo for Holidaze"
            className="h-5 sm:h-7 cursor-pointer"
          />
        </button>

        {/* Desktop Search (hidden on small screens) */}
        <div className="hidden md:block">
          <SearchBar />
        </div>

        {/* User & Search icons */}
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          {/* Search icon for mobile */}
          <button
            onClick={() => setShowMobileSearch((prev) => !prev)}
            className="md:hidden text-xl text-espressoy hover:text-orangey cursor-pointer"
            aria-label="Toggle Search"
          >
            <FaSearch />
          </button>

          {/* Avatar / User Icon */}
          <div
            onClick={() =>
              isLoggedIn ? setShowDropdown((prev) => !prev) : navigate("/login")
            }
            className="cursor-pointer"
          >
            {renderUserIcon()}
          </div>

          {/* Dropdown */}
          {isLoggedIn && (
            <div
              className={`absolute right-0 top-12 sm:top-14 w-40 bg-white border border-espressoy rounded shadow-md text-sm z-50 transform transition-all duration-300 ease-out origin-top-right cursor-pointer ${
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
      </header>

      {/* Mobile search bar below header */}
      {showMobileSearch && (
        <div className="px-4 pb-4 sm:hidden">
          <MobileSearchBar onClose={() => setShowMobileSearch(false)} />
        </div>
      )}
    </>
  );
}
