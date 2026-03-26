import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'
import { useSelector } from 'react-redux'

const MainLayout = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar only if logged in */}
      {user && (
        <div className="w-64 border-r h-screen overflow-y-auto fixed">
          <LeftSidebar />
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 ${user ? "ml-64" : ""}`}>
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout