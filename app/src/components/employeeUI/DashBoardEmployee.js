import React from 'react'
import HeaderEmployee from './HeaderEmployee'
import HomeEmployee from './HomeEmployee'
import SideNavEmployee from './SideNavEmployee'
import Footeremployee from './Footeremployee'
import { Outlet } from 'react-router-dom'

const DashBoardEmployee = () => {
  return (
    <div>
        <HeaderEmployee />
        <Outlet />
        <SideNavEmployee />
        <Footeremployee />
    </div>
  )
}

export default DashBoardEmployee
