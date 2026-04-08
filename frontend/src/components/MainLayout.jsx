import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'
import { useSelector } from 'react-redux'

const MainLayout = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar Section */}
      {user && (
        /* 'fixed' wapas laa rahe hain lekin 'hidden md:block' ke saath 
           taaki mobile pe jagah na ghere aur desktop pe chipka rahe */
        <div className="hidden md:block w-64 border-r h-screen fixed left-0 top-0 bg-white z-50">
          <LeftSidebar />
        </div>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 w-full flex justify-center ${user ? "md:ml-64 pb-20 md:pb-0" : ""}`}>
        {/* 'md:ml-64' is the magic! Ye desktop pe sidebar ki jagah chhodega 
            aur mobile pe (ml-0 default) content ko center rakhega */}
        <div className="w-full max-w-2xl">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default MainLayout