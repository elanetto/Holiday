import { useState, useEffect } from "react";
import UserContext from "./UserContext";

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const avatarUrl = localStorage.getItem("avatar");
    const nameData = localStorage.getItem("name");
  
    if (token) {
      setIsLoggedIn(true);
      setAvatar(avatarUrl || "");
      setName(nameData || "");
    }
  }, []);
  
  const loginUser = (user) => {
    localStorage.setItem("token", user.token);
    localStorage.setItem("avatar", user.avatar);
    localStorage.setItem("name", user.name);
  
    setIsLoggedIn(true);
    setAvatar(user.avatar || "");
    setName(user.name || "");
  };  

  const logoutUser = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setAvatar("");
    setName("");
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, avatar, name, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
