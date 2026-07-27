import { createBrowserRouter } from "react-router";
import Home from "../Pages/Home";
import Root from "../Layout/Root";
import Register from "../Auth/Register";
import AuthLayout from "../Layout/AuthLayout";
import Login from "../Auth/Login";
import ForgotPassword from "../Auth/ForgotPassword";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/forgot",
        element: <ForgotPassword />,
      },
      
    ],
  },
]);
