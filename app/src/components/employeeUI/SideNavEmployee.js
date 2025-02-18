import React from "react";
import { Link, useParams } from "react-router-dom";
import { retrieve } from "../Encryption";

const SideNavEmployee = () => {
  // const {employeeId} =useParams().id
  const employeeId = retrieve().employee.id;
  return (
    <div>
      <div>
        {/* Main Sidebar Container */}
        <aside className="main-sidebar sidebar-dark-primary elevation-4" >
          <a href="index3.html" className="brand-link">
            <span
              className="brand-text font-weight-light"
              style={{ marginLeft: "70px" }}
            >
              HRS
            </span>
          </a>

          <div className="sidebar">
            <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className=""  style={{marginLeft:"30px",color:"white",font:"helvetica"}}>
     
     Employee's DashBoard
   

</div>
</div>
            {/* SidebarSearch Form */}
            <div className="form-inline">
              
            </div>
            {/* Sidebar Menu */}
            <nav className="mt-2">
              <ul
                className="nav nav-pills nav-sidebar flex-column"
                data-widget="treeview"
                role="menu"
                data-accordion="false"
              >
              

                <li className="nav-item">
                  <a href="#" className="nav-link">
                    <i className="nav-icon fas fa-user-circle" />
                    <p>
                      <Link to={"/employee/profile"}>Profile</Link>
                    </p>
                  </a>
                </li>

                <li className="nav-item">
                  <Link to={"/employee/goals"} className="nav-link">
                    <i className="nav-icon fas fa-eye" />
                    <p>View Goals</p>
                  </Link>
                </li>



                <li className="nav-item">
                  <Link to={"/employee/add_goals"} className="nav-link">
                    <i className="nav-icon fas fa-bullseye" />
                    <p>Add Goals</p>
                  </Link>
                </li>



                <li className="nav-item">
                  <a href="#" className="nav-link">
                    <i className="nav-icon fas fa-money-check-alt" />
                    <p>
                      <Link to={"/employee/payslip"}>Payslips</Link>
                    </p>
                  </a>
                </li>

                <li className="nav-item">
                  <a href="#" className="nav-link">
                    <i className="nav-icon fas fa-graduation-cap" />
                    <p>
                      <Link to={`/employee/view_education/${employeeId}`}>
                        Education
                      </Link>
                    </p>
                  </a>
                </li>

                <li className="nav-item">
                  <a href="#" className="nav-link">
                    <i className="nav-icon fas fa-file-alt" />
                    <p>
                      <Link to={`/employee/view_documents/${employeeId}`}>
                        Documents
                      </Link>
                    </p>
                  </a>
                </li>


                <li className="nav-item">
                  <Link to={"/employee/view_experience"} className="nav-link">
                    <i className="nav-icon fas fa-briefcase" />
                    <p>View/Update Experience</p>
                  </Link>
                </li>




                <li className="nav-item">
                  <a href="#" className="nav-link">
                    <i className="nav-icon fas fa-calendar-check" />
                    <p>
                      <Link to={`/employee/view_leaves/${employeeId}`}>
                        Leave Tracker
                      </Link>
                    </p>
                  </a>
                </li>

                <li className="nav-item">
                  <a href="#" className="nav-link">
                    <i className="nav-icon fas fa-chalkboard-teacher" />
                    <p>
                      <Link to={`/employee/view_trainings/${employeeId}`}>
                        Training Tracker
                      </Link>
                    </p>
                  </a>
                </li>
               
              </ul>
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SideNavEmployee;
