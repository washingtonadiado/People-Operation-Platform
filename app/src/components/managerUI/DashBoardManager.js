import React from 'react'
import HeaderManager from './HeaderManager'
import HomeManager from './HomeManager'
import SideNavManager from './SideNavManager'
import FooterManager from './FooterManager'
import { Outlet } from 'react-router-dom'

const DashBoardManager = () => {
  return (
    <div>
        <HeaderManager />
        <Outlet />
        <SideNavManager />
        <FooterManager />
      
    </div>
  )
}

export default DashBoardManager
