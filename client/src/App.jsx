import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';

import Feed from './Components/Feed/Feed';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import Profile from './Components/Profile';
import Nav from './Components/Nav';
import EditProfile from "./Components/EditProfile";
import CreatePost from './Components/Feed/CreatePost';
import SearchPage from './Components/Search/SearchPage';

// Import the UserProvider context
import { UserProvider } from './context/UserContext';

const AppRoutes = () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const isLoggedIn = !!token;

  const location = useLocation();
  const hideNav = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNav && <Nav />}

      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn
              ? <Navigate to="/feed" />
              : userId
                ? <Navigate to="/login" />
                : <Navigate to="/register" />
          }
        />

        <Route path="/feed" element={isLoggedIn ? <Feed /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/edit-profile" element={isLoggedIn ? <EditProfile /> : <Navigate to="/login" />} />
        <Route path="/create" element={isLoggedIn ? <CreatePost /> : <Navigate to="/login" />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </>
  );
};

const App = () => (
  <UserProvider>
    <Router>
      <AppRoutes />
    </Router>
  </UserProvider>
);

export default App;
