import React, { useEffect, useState } from "react";
import "./employeeProfile.css";
import { retrieve } from "../Encryption";
import profile from "../../assets/profile.png";
import { Link, useNavigate } from "react-router-dom";

const EmployeeProfile = () => {
  const [employee, setEmployee] = useState(null);
  const id = retrieve().employee.id;
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://hrs-iymg.onrender.com/employees/${id}`)
      .then((response) => {
        if (!response.ok) {
          response.json().then((error) => console.log(error));
        }
        return response.json();
      })
      .then((data) => setEmployee(data))
      .catch((err) => console.log(err));
  }, []);
  console.log(employee);
  if (!employee) return <div className="loader">loading...</div>;
  console.log(employee);
  if (employee?.employee_profiles?.length === 0)
    return navigate("/employee/profile/create");
  const employeeProfileData = employee.employee_profiles[0];

  const handleEditButtonClick = () => {
    navigate("/employee/profile/edit");
  };

  const handleResetPasswordButtonClick = () => {
    navigate("/change_password");
  };
  return (
    <div
      className="content-wrapper"
      style={{
        marginLeft: "280px",
        backgroundColor: "white",
        marginTop: "20px",
      }}
    >
      <div className="profile-container">
        <div className="main">
          <div className="row">
            <div className="col md-8 mt-1">
              <div className="card mb-3 content">
                <div className="col-md-3">
                  <img
                    src={employeeProfileData?.profile_photo || profile}
                    alt="profile"
                    className="rounded-circle profile"
                    width={150}
                  />
                </div>
                <h1 className="m-3 pt-3">{employeeProfileData.mantra}</h1>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-3">
                      <h5>Full Name</h5>
                    </div>
                    <div className="col-md-9 text-secondary">
                      {employeeProfileData.first_name}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <h5>Last Name</h5>
                    </div>
                    <div className="col-md-9 text-secondary">
                      {employeeProfileData.last_name}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <h5>Contact</h5>
                    </div>
                    <div className="col-md-9 text-secondary">
                      {employeeProfileData.phone_contact}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <h5>Email</h5>
                    </div>
                    <div className="col-md-9 text-secondary">
                      {employee.email}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <h5>Date of Birth</h5>
                    </div>
                    <div className="col-md-9 text-secondary">
                      {employeeProfileData.date_of_birth}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card mb-3 content">
                <h1 className="m-3 pt-3">Session Goals</h1>
                {employee.goals.length !== 0 ? (
                  employee.goals.map((goal) => (
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-3">
                          <h5>{goal.name}</h5>
                        </div>
                        <div className="col-md-9 text-secondary">
                          {goal.description}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <h5 className="text-secondary">No goals have been set</h5>
                )}
              </div>
              <div className="card mb-3 content">
                <h1 className="m-3 pt-3">Recent Payslip</h1>
                {employee.remunerations.length !== 0 ? (
                  employee.remunerations.map((payslip) => (
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-3">
                          <h5>{payslip.name}</h5>
                        </div>
                        <div className="col-md-9 text-secondary">
                          {payslip.salary}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <h5 className="text-secondary">No recent payslips</h5>
                )}
              </div>
              <div className="card mb-3 content">
                <h1 className="m-3 pt-3">Approved Leaves</h1>
                {employee.leaves?.length !== 0 ? (
                  employee.leaves
                    .filter((leave) => leave.approved)
                    .map((leave) => (
                      <div className="card-body">
                        <div className="col-md-3">
                          <h5>start</h5>
                        </div>
                        <div className="col-md-9 text-secondary">
                          {leave.start_date}
                        </div>
                        <div className="col-md-3">
                          <h5>end</h5>
                        </div>
                        <div className="col-md-9 text-secondary">
                          {leave.end_date}
                        </div>
                      </div>
                    ))
                ) : (
                  <h5 className="text-secondary">No approved leaves</h5>
                )}
              </div>
              <button
                type="update"
                className="btn btn-primary"
                onClick={handleEditButtonClick}
              >
                Edit Profile
              </button>
              <button
                type="update"
                className="btn btn-primary"
                onClick={handleResetPasswordButtonClick}
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
