import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function RoleRoute({ role, children }) {
  const { user } = useContext(AuthContext);

  // not logged in
  if (!user) return <Navigate to="/login" />;

  // wrong role
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
}