import React from "react";
import { useAuth } from "../Hooks/useAuth";
import useRole from "../Hooks/useRole";
import Forbidden from "../Pages/Forbidden";

const bloggerRoute = ({ children }) => {
  const { loading: bloggerLoading, user } = useAuth();
  const { role, roleLoading } = useRole();

  if (bloggerLoading || !user || roleLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg text-green-500"></span>
      </div>
    );
  }

  if(role !== 'blogger'){
    return <forbidden />
  }

  return <div>{children}</div>;
};

export default bloggerRoute;
