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

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
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