import Signup from './components/Signup.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Children } from 'react'
import Login from './components/Login.jsx'
import MainLayout from './components/MainLayout.jsx'
// import { Home } from 'lucide-react'
import Profile from './components/Profile.jsx'
import Home from './components/Home.jsx'
import VerificationPage from './components/VerificationPage.jsx'
import "./App.css";
import EditProfile from './components/EditProfile.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import SearchPage from './components/SearchPage.jsx'
import CategoryPage from './components/CategoryPage.jsx'

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "profile/edit",
        element: <EditProfile />
      },
      {
        path: "profile/:id",
        element: <Profile />
      },
      {
        path: "search",
        element: <SearchPage />
      },
      {
        path: "/category/:type",
        element: <CategoryPage />
      }
    ]
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/verify-otp',
    element: <VerificationPage />
  }
]);

function App() {

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App