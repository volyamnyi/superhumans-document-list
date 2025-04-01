import React, { createContext, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext({
  user: null,
  handleLogin: (accessToken) => {},
  handleLogout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    firstName: "",
    lastName: "",
    login: "",
    token: "",
    businessRole: "",
  });

  const handleLogin = (accessToken) => {
    const decodedUser = jwtDecode(accessToken);
    localStorage.setItem("sub", decodedUser.sub);
    localStorage.setItem("firstName", decodedUser.firstName);
    localStorage.setItem("lastName", decodedUser.lastName);
    localStorage.setItem("businessRole", decodedUser.businessRole);
    localStorage.setItem("accessToken", accessToken);
    setUser(decodedUser);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
