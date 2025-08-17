import React, { useState } from "react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import MainLayout from "./components/MainLayout";
import Home from "./components/Home";
import Profile from "./components/Profile";
import CreatePost from "./components/CreatePost";
import Notifications from "./components/Notifications";
import Search from "./components/Search";
import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";

const LayoutWithModal = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="theme-dark"> {/* Global theme wrapper */}
      {/* Main layout with sidebar */}
      <MainLayout setIsCreateOpen={setIsCreateOpen} />

      {/* Outlet for nested routes */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* CreatePost modal */}
      <CreatePost open={isCreateOpen} setOpen={setIsCreateOpen} />
    </div>
  );
};

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "profile", element: <Profile /> },
      { path: "notifications", element: <Notifications /> },
      { path: "search", element: <Search /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
]);

function App() {
  return (
    <div className="theme-dark"> {/* Global theme applied here too */}
      <RouterProvider router={browserRouter} />
    </div>
  );
}

export default App;