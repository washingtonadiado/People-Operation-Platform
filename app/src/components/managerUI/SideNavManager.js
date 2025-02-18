import React from 'react'
import { Link } from 'react-router-dom';
import { retrieve } from '../Encryption'



const SideNavManager = () => {
  const deptId=retrieve().manager.dept_id
  return (
    <div>
         <div>
 {/* Main Sidebar Container */}
<aside className="main-sidebar sidebar-dark-primary elevation-4">
  {/* Brand Logo */}
  <a href="index3.html" className="brand-link">
    {/* <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" className="brand-image img-circle elevation-3" style={{opacity: '.8'}} /> */}
    <span className="brand-text font-weight-light" style={{ marginLeft: "70px"}}>HRS</span>
  </a>
  {/* Sidebar */}
  <div className="sidebar">
    {/* Sidebar user panel (optional) */}
    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
      <div className=""  style={{marginLeft:"30px",color:"white",font:"helvetica"}}>
     
              Manager's DashBoard
            
     
      </div>
      
    </div>
    {/* SidebarSearch Form */}
    
    {/* Sidebar Menu */}
    <nav className="mt-2">
      <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">

      <li className="nav-item">
          <Link to="/manager/manager_profile" className="nav-link">
          <i className="nav-icon fas fa-user-circle" />
            <p>
              Profile
            </p>
          </Link>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link">
            <i className="nav-icon fas fa-users" />
            <p>
        
            <Link to={"/manager/departments"}>Departments</Link> 
           
            </p>
          </a>
         
        </li>

        <li className="nav-item">
          <a href="#" className="nav-link">
            <i className="nav-icon fas fa-users" />
            <p>
        
            <Link to={`/manager/department_employees/${deptId}`}>Team</Link> 
           
            </p>
          </a>
         
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link">
            <i className="nav-icon fas fa-users" />
            <p>
        
             <Link to="/manager/view_department_trainings">Training Tracker</Link> 
            </p>
          </a>
         
        </li>


        <li className="nav-item">
          <Link to="/manager/manager_pending_leaves" className="nav-link">
          <i className="nav-icon fas fa-hourglass-half" />
            <p>
              Leave Tracker
            </p>
          </Link>
        </li>


       


      
         
      </ul>
    </nav>
    {/* /.sidebar-menu */}
  </div>
  {/* /.sidebar */}
</aside>

      
    </div>
      
    </div>
  )
}

export default SideNavManager
