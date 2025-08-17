import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideNavBar from './SideNavBar';

const MainLayout = () => {
  const [selectedCategory, setSelectedCategory] = useState("Entertainment");

  return (
    <div>
      <SideNavBar 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
      />
      <Outlet /> {/* Child pages yahan render honge */}
    </div>
  );
}

export default MainLayout;