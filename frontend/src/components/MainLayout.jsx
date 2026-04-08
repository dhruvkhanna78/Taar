import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'
import { useSelector } from 'react-redux'

const MainLayout = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full overflow-x-hidden">
      {user && <LeftSidebar />}
      
      {/* Is div ko dhyan se dekh, 'flex-1' aur 'w-full' zaroori hai */}
      <div className={`flex-1 w-full min-w-0 ${user ? "md:ml-64 pb-24 md:pb-0" : ""}`}>
        <Outlet />
      </div>
    </div>
  )
}
export default MainLayout