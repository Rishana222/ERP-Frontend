import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

interface PrivateRouteProps {
  children: React.ReactNode;
}

// Protect routes that REQUIRE login
export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = Cookies.get("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Protect login page (logged-in users shouldn't see login)
export const LoginProtect = ({ children }: PrivateRouteProps) => {
  const token = Cookies.get("token");

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
