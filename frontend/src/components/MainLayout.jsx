import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

const MainLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <div className="w-64 border-r h-screen overflow-y-auto fixed">
        <LeftSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
