import { createContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const isVenueManager = localStorage.getItem("isVenueManager") === "true";
    const avatar = localStorage.getItem("avatar");
    const apiKey = localStorage.getItem("apiKey");

    if (token && name && email && apiKey) {
      setUser({ token, name, email, isVenueManager, avatar, apiKey });
    }
  }, []);

  const loginUser = ({
    token,
    name,
    email,
    isVenueManager,
    avatar,
    apiKey,
  }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("isVenueManager", isVenueManager);
    localStorage.setItem("avatar", avatar || "");
    localStorage.setItem("apiKey", apiKey);

    setUser({ token, name, email, isVenueManager, avatar, apiKey });
  };

  const logoutUser = () => {
    localStorage.clear();
    setUser(null);
    // Ensure window reload to fully reset state-dependent components
    window.location.reload();
  };

  return (
    <UserContext.Provider
      value={{
        ...user,
        isLoggedIn: !!user,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
