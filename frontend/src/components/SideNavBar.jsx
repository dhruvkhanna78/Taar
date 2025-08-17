import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import CreatePost from './CreatePost';
import ImageFallback from './ImageFallback';

const icons = [
  { name: 'Home', path: '/', icon: <i className="fi fi-rr-home" style={{ marginRight: 8, fontSize: 20 }}></i> },
  { name: 'Search', path: '/search', icon: <i className="fi fi-rr-search" style={{ marginRight: 8, fontSize: 20 }}></i> },
  { name: 'Create', path: null, icon: <i className="fi fi-rr-plus" style={{ marginRight: 8, fontSize: 20 }}></i> },
  { name: 'Notifications', path: '/notifications', icon: <i className="fi fi-rr-bell" style={{ marginRight: 8, fontSize: 20 }}></i> },
  {
    name: 'Profile',
    path: '/profile',
    icon: (
      <ImageFallback
        src='https://img.daisyui.com/images/profile/demo/batperson@192.webp'
        fallbackSrc='https://t4.ftcdn.net/jpg/11/28/72/75/240_F_1128727502_ce2UdfqSn42Ia48OeSy7a6UBX590HZnJ.jpg'
        alt='Profile'
        className="w-8 h-8 rounded-full overflow-hidden"
      />
    )
  },
  { name: 'Logout', path: null, icon: <i className="fi fi-rr-sign-out-alt" style={{ marginRight: 8, fontSize: 20, color: 'red' }} /> },
];

const categories = ["Entertainment", "Learning", "Art", "Coding"];

const selectedCategoryBadge = (cat) => {
  switch(cat) {
    case "Entertainment": return "badge-primary";
    case "Learning": return "badge-secondary";
    case "AR & Literature": return "badge-accent";
    case "Coding": return "badge-info";
    default: return "badge-neutral";
  }
};

const SideNavBar = ({ selectedCategory, setSelectedCategory }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openCreate, setOpenCreate] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/user/logout', { withCredentials: true });
      if (res.data.success) {
        navigate('/login');
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className='fixed top-0 left-0 px-4 border-r border-gray-300 w-[16%] h-screen overflow-y-auto'>
      <Toaster position="top-right" />

      <div className='flex flex-col'>
        {/* Logo */}
        <div className='gap-4 px-3 py-2'>
          <h1 className='h-14 w-14 text-3xl font-bold flex items-center justify-center'>Taar</h1>
        </div>

        {/* Sidebar items */}
        <div className='gap-4 px-3 py-2 flex flex-col'>
          {icons.map((item, index) => {
            if (item.name === 'Logout') {
              return (
                <div
                  key={index}
                  onClick={() => window.confirm("Are you sure you want to log out?") && logoutHandler()}
                  className='flex items-center gap-4 hover:bg-gray-100/60 cursor-pointer rounded-lg p-3 my-1 transition'
                >
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              );
            } else if (item.name === 'Create') {
              return (
                <div
                  key={index}
                  onClick={() => setOpenCreate(true)}
                  className='flex items-center gap-4 hover:bg-gray-100/60 cursor-pointer rounded-lg p-3 my-1 transition'
                >
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              );
            } else if (item.name === 'Profile') {
              return (
                <div key={index} className='flex flex-col'>
                  <NavLink
                    to={item.path}
                    className='flex items-center gap-4 cursor-pointer rounded-lg p-3 my-1 transition hover:bg-gray-100/60'
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </NavLink>

                  {/* Category Dropdown */}
                  <div className="dropdown w-full mt-2">
                    <label
                      tabIndex={0}
                      className="btn btn-outline w-full text-left text-sm border-none flex justify-between items-center"
                    >
                      <span className="truncate">Category</span>
                      {selectedCategory && (
                        <div className={`badge ${selectedCategoryBadge(selectedCategory)} ml-2 whitespace-nowrap truncate`}>
                          {selectedCategory}
                        </div>
                      )}
                      <i className="fi fi-rr-angle-small-down ml-2"></i>
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu shadow bg-base-100 rounded-box w-full mt-1"
                    >
                      {categories.map(cat => (
                        <li key={cat}>
                          <button
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 transition rounded flex items-center gap-2"
                            onClick={() => setSelectedCategory(cat)}
                          >
                            <div className={`badge ${selectedCategoryBadge(cat)} whitespace-nowrap truncate`}>{cat}</div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            } else {
              return (
                <NavLink
                  key={index}
                  to={item.path}
                  end={item.name === 'Home'}
                  className={({ isActive }) =>
                    `flex items-center gap-4 cursor-pointer rounded-lg p-3 my-1 transition 
                    ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100/60'}`
                  }
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              );
            }
          })}

          {/* CreatePost modal */}
          {openCreate && <CreatePost open={openCreate} setOpen={setOpenCreate} />}
        </div>
      </div>
    </div>
  );
};

export default SideNavBar;
