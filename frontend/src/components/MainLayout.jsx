import React from 'react'
import { Outlet } from 'react-router-dom'
import SideNavBar from './SideNavBar'

const MainLayout = () => {
    return (
        <div>
            <div>
                <SideNavBar />
                <div>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default MainLayout
