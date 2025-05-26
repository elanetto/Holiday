import { useState, useEffect } from "react";
import UserContext from "./UserContext";

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(true); // ✅ Added loading state

  useEffect(() => {
    const token = localStorage.getItem("token");
    const avatarData = localStorage.getItem("avatar");
    const nameData = localStorage.getItem("name");
    const venueManagerFlag = localStorage.getItem("isVenueManager") === "true";
    const storedApiKey = localStorage.getItem("apiKey");

    let parsedAvatar = "";

    try {
      parsedAvatar = avatarData ? JSON.parse(avatarData) : "";
    } catch {
      parsedAvatar = avatarData; // fallback if not JSON
    }

    if (token) {
      setIsLoggedIn(true);
      setAvatar(parsedAvatar?.url || parsedAvatar || "");
      setName(nameData || "");
      setIsVenueManager(venueManagerFlag);
      setApiKey(storedApiKey || "");
    }

    setLoading(false); // ✅ Done checking login status
  }, []);

  const loginUser = ({ token, name, email, avatar, isVenueManager, apiKey }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("avatar", JSON.stringify(avatar));
    localStorage.setItem("isVenueManager", isVenueManager);
    if (apiKey) localStorage.setItem("apiKey", apiKey);

    setIsLoggedIn(true);
    setName(name);
    setAvatar(avatar?.url || avatar || "");
    setIsVenueManager(!!isVenueManager);
    setApiKey(apiKey || "");
  };

  const logoutUser = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setAvatar("");
    setName("");
    setIsVenueManager(false);
    setApiKey("");
  };

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        name,
        avatar,
        isVenueManager,
        apiKey,
        loginUser,
        logoutUser,
        loading, // ✅ Expose loading state
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
