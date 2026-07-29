import React from "react";
import { useAuth } from "../Hooks/useAuth";
import useRole from "../Hooks/useRole";
import Forbidden from "../Pages/Forbidden";

const AdminRoute = ({ children }) => {
  const { loading: adminLoading, user } = useAuth();
  const { role, roleLoading } = useRole();

  if (adminLoading || !user || roleLoading) {
    <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner loading-lg text-green-500"></span>
    </div>;
  }

  if(role !== 'admin'){
    return <Forbidden />
  }

  return <div>{children}</div>;
};

export default AdminRoute;
