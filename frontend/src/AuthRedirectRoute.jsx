import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AuthRedirectRoute = () => {
  const isAuthenticated = !!localStorage.getItem("authToken");

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default AuthRedirectRoute;
