import React from 'react'
import HeaderHr from './HeaderHr'
import HomeHr from './HomeHr'
import FooterHr from './FooterHr'
import SideNavHr from './SideNavHr'
import { Outlet } from 'react-router-dom'

const DashBoardHr = () => {
  return (
    <div>
        <HeaderHr/>
        <Outlet/>
        <SideNavHr />
        <FooterHr/>
      
    </div>
  )
}

export default DashBoardHr