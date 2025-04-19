import { useState, useEffect } from "react";
import UserContext from "./UserContext";

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const avatarData = localStorage.getItem("avatar");
    const parsedAvatar = avatarData ? JSON.parse(avatarData) : "";
    const nameData = localStorage.getItem("name");
    const adminFlag = localStorage.getItem("isAdmin") === "true";

    if (token) {
      setIsLoggedIn(true);
      setAvatar(parsedAvatar || "");
      setName(nameData || "");
      setIsAdmin(adminFlag);
    }
  }, []);

  const loginUser = (user) => {
    localStorage.setItem("token", user.token);
    localStorage.setItem("avatar", JSON.stringify(user.avatar));
    localStorage.setItem("name", user.name);
    localStorage.setItem("isAdmin", user.isAdmin);

    setIsLoggedIn(true);
    setAvatar(user.avatar?.url || user.avatar || "");
    setName(user.name || "");
    setIsAdmin(!!user.isAdmin);
  };

  const logoutUser = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setAvatar("");
    setName("");
    setIsAdmin(false);
  };

  return (
    <UserContext.Provider
      value={{ isLoggedIn, avatar, name, isAdmin, loginUser, logoutUser }}
    >
      {children}
    </UserContext.Provider>
  );
};
