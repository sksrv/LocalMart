import { createContext, useState } from "react";
import API from "../../services/api.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const login = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  //  Call this after store creation to refresh role without logout
  const refreshUser = async () => {
    try {
      const res = await API.get("/auth/me");
      const updated = { ...user, role: res.data.role, email: res.data.email };
      localStorage.setItem("user", JSON.stringify(updated));
      setUser(updated);
    } catch (err) {
      console.error("Failed to refresh user", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};