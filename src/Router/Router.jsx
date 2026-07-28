import { createBrowserRouter } from "react-router";
import Home from "../Pages/Home";
import Root from "../Layout/Root";
import Register from "../Auth/Register";
import AuthLayout from "../Layout/AuthLayout";
import Login from "../Auth/Login";
import ForgotPassword from "../Auth/ForgotPassword";
import AddBlog from "../Pages/AddBlog";
import Profile from "../Auth/Profile";
import AllBlogs from "../Pages/Blogs/AllBlogs";
import PrivateRoute from "./PrivateRoute";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/add-blog",
        element: <PrivateRoute>
          <AddBlog />
        </PrivateRoute>
      },
      {
        path: "/all-blogs",
        element: <AllBlogs />
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
      {
        path: "/profile",
        element: <Profile />,
      },
      
    ],
  },
]);
