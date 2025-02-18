import { Link, useParams } from "react-router-dom";
const SideNavHr = () => {
  const { hrId } = useParams();
  return (
    <div>
      {/* Main Sidebar Container */}
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <a href="index3.html" className="brand-link">
          <span
            className="brand-text font-weight-light"
            style={{ marginLeft: "70px" }}
          >
            HRS
          </span>
        </a>
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image"></div>
          </div>
          {/* SidebarSearch Form */}

          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              <li className="nav-item">
                <Link to="/hr/hr_profile" className="nav-link">
                  <i className="nav-icon fas fa-user-circle" />
                  <p>Profile</p>
                </Link>
              </li>

              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-users" />
                  <p>
                    <Link to={"/hr/view_staff_details"}>Employees</Link>
                  </p>
                </a>

                <Link to={"/hr/add_employee"} className="nav-link">
                  <i className="nav-icon fas fa-user-plus" />
                  <p>Onboard Employee</p>
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link to={"/hr/hr_delete_employee"} className="nav-link">
                  <i className="nav-icon fas fa-user-minus" />
                  <p>Offboard Employee</p>
                </Link>
              </li> */}

              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-users-cog" />
                  <p>
                  
                    <Link to={"/hr/view_managers"}>Managers</Link>
                  
                  </p>
                </a>
            
              </li>

              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-folder-open" />
                  <p>
                    <Link to={"/hr/view_employees_documents"}>Documents</Link>
                  </p>
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-book" />
                  <p>
                    <Link to={"/hr/staff_education"}>Education</Link>
                  </p>
                </a>
              </li>
              <li className="nav-item">
                <Link to="/hr/view_employee_payslip" className="nav-link">
                  <i className="nav-icon fas fa-money-check-alt" />
                  <p>Payroll</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/hr/view_leaves" className="nav-link">
                  <i className="nav-icon fas fa-hourglass-half" />
                  <p>Leave Tracker</p>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/hr/hr_pending_leaves" className="nav-link">
                  <i className="nav-icon fas fa-hourglass-half" />
                  <p>Approve Leaves</p>
                </Link>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-chalkboard-teacher" />
                  <p>
                    <Link to="/hr/training_page">Training Tracker</Link>
                  </p>
                </a>
              </li>
              <li className="nav-item">
                <Link to="/hr/session" className="nav-link">
                  <i className="nav-icon fas fa-users-cog" />
                  <p>session</p>
                </Link>
              </li>
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    </div>
  );
};

export default SideNavHr;
