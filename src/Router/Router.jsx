import { createBrowserRouter } from "react-router";
import Home from "../Pages/Home/Home";
import Root from "../Layout/Root";
import Register from "../Auth/Register";
import AuthLayout from "../Layout/AuthLayout";
import Login from "../Auth/Login";
import ForgotPassword from "../Auth/ForgotPassword";
import AddBlog from "../Pages/AddBlog";
import Profile from "../Auth/Profile";
import AllBlogs from "../Pages/Blogs/AllBlogs";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../Pages/Dashboard/dashboard";
import UserProfile from "../Pages/Dashboard/UserProfile";
import UserManagement from "../Pages/Dashboard/UserManagement";
import BloggerManagement from "../Pages/Dashboard/BloggerManagement";
import Chat from "../Pages/Messages/Chat";
import CommentsManagement from "../Pages/Dashboard/CommentsManagement";
import MessagesManagement from "../Pages/Dashboard/MessagesManagement";
import AdminRoute from "../Router/AdminRoute"
 
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
        element: (
          <PrivateRoute>
            <AddBlog />
          </PrivateRoute>
        ),
      },
      {
        path: "/all-blogs",
        element: <AllBlogs />,
      },
      {
        path: "/chats",
        element: <PrivateRoute>
          <Chat />
        </PrivateRoute>,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
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
  {
    path: "dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "profile",
        element: <UserProfile />,
      },
      {
        path: "user-management",
        element: <UserManagement />,
      },
      {
        path: "blogger-management",
        element: <BloggerManagement />,
      },
      {
        path: "comments-management",
        element: <CommentsManagement />,
      },
      {
        path: "messages-management",
        element: <PrivateRoute>
          <AdminRoute>
            <MessagesManagement />
          </AdminRoute>
        </PrivateRoute>,
      },
    ],
  },
]);
