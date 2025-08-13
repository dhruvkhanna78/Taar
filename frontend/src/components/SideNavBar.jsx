import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ImageFallback from './ImageFallback';
const icons = [
  { name: 'Home', icon: <i className="fi fi-rr-home" style={{ marginRight: 8, fontSize: 20 }}></i> },
  { name: 'Search', icon: <i className="fi fi-rr-search" style={{ marginRight: 8, fontSize: 20 }}></i> },
  { name: 'Create', icon: <i className="fi fi-rr-plus" style={{ marginRight: 8, fontSize: 20 }}></i> },
  { name: 'Notifications', icon: <i className="fi fi-rr-bell" style={{ marginRight: 8, fontSize: 20 }}></i> },
  {
    name: 'Profile',
    icon: (
      <ImageFallback
        src='https://img.daisyui.com/images/profile/demo/batperson@192.webp'
        fallbackSrc='https://t4.ftcdn.net/jpg/11/28/72/75/240_F_1128727502_ce2UdfqSn42Ia48OeSy7a6UBX590HZnJ.jpg'
        alt='Profile'
        className="w-8 h-8 rounded-full overflow-hidden"
      />
    )
  },
  { name: 'Logout', icon: <i className="fi fi-rr-sign-out-alt" style={{ marginRight: 8, fontSize: 20, color: 'red' }} /> },


]

const SideNavBar = () => {
  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/user/logout', { withCredentials: true });
      if (res.data.success) {
        navigate('/login');
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.respose.data.message);
    }
  }

  const sidebarHandler = (textType) => {
    // alert(textType)
    if (textType === 'Logout') {
      const confirmation = window.confirm("Are you sure you want to log out?");

      if (confirmation) {
        logoutHandler();
      }
    }
  }

  return (
    <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
      <div className='flex flex-col'>
        <div className='gap-4 px-3 py-2'>
          <h1 className='h-14 w-14 text-3xl font-bold flex items-center justify-center'>Taar</h1>
        </div>
        <div>
          {
            icons.map((item, index) => {
              return (
                <div onClick={() => sidebarHandler(item.name)} key={index} className='flex item-center gap-4 relative hover:bg-gray-100/60 cursor-pointer rounded-lg p-3 my-3'>
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default SideNavBar
