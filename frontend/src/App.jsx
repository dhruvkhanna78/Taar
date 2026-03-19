import path from 'path'
import Signup from './components/Signup.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Children } from 'react'
import Login from './components/Login.jsx'
import MainLayout from './components/MainLayout.jsx'
// import { Home } from 'lucide-react'
import Profile from './components/Profile.jsx'
import Home from './components/Home.jsx'
import VerificationPage from './components/VerificationPage.jsx'

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/profile',
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
    path: '/verify-otp', // Naya route for OTP
    element: <VerificationPage />
  }
])

function App() {

  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  )
}

export default App
