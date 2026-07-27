import React from "react";
import { Outlet } from "react-router";
// import authImg from "../assets/authImg.png";
// import Logo from "../Component/Logo";

const AuthLayout = () => {
  return (
    <div>
      {/* <div className="max-w-4xl mx-auto"> */}
        {/* <Logo /> */}
        {/* <div className="flex justify-center items-center gap-10"> */}
          <div className="">
            <Outlet></Outlet>
          </div>
          {/* <div className="flex-1">
            <img src={authImg} alt="" className="w-[520px]  rounded-2xl" />
          </div> */}
        {/* </div> */}
      {/* </div> */}
    </div>
  );
};

export default AuthLayout;
