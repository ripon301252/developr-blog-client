import React from "react";
import { useAuth } from "../Hooks/useAuth";
import { useLocation, Navigate } from "react-router";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if(user) return children;
  return <Navigate state={location?.pathname} to={`/login`}></Navigate>;
};

export default PrivateRoute;
