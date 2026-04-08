import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSideBar from './RightSideBar'
import useGetAllPost from '../hooks/useGetAllPost'

const Home = () => {
  useGetAllPost();
  return (
    // min-h-screen add kiya taaki background consistent rahe
    <div className='flex flex-col md:flex-row min-h-screen bg-gray-50'>
      <div className="flex-grow w-full">
        <Feed />
        <Outlet />
      </div>
      {/* Desktop par hi RightSideBar dikhega, mobile par hide kar diya hai standard social media ki tarah */}
      <div className='hidden lg:block w-[30%] border-l border-gray-200'>
        <RightSideBar />
      </div>
    </div>
  )
}

export default Home