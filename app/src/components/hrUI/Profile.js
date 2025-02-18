import React, { useState, useEffect } from "react";
import "./profile.css";
import profile from "../../assets/profile.png";
import { Link, useNavigate } from "react-router-dom";
import { retrieve } from "../Encryption";

const Profile = () => {
  const [hr, setHr] = useState(null);
  const id = retrieve().hr.id;
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://hrs-iymg.onrender.com/hr_personnels/${id}`)
      .then((response) => response.json())
      .then((data) => setHr(data))
      .catch((err) => console.log(err));
  }, []);

  if (!hr) return <div>Loading...</div>;
  console.log(hr);
  if (hr?.hr_profiles?.length === 0) return navigate(`/hr/create_profile`);
  const hrProfileData = hr?.hr_profiles[0];

  function handleLogout(e) {
    fetch("https://hrs-iymg.onrender.com/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + retrieve().access_token,
        Accept: "application/json",
      },
    }).then((resp) => {
      if (resp.ok) {
        localStorage.clear();
        navigate("/login");
      }
    });
  }

  const handleEditButtonClick = () => {
    navigate('/hr/edit_profile');
  };

  const handleResetPasswordButtonClick = () => {
    navigate('/change_password');
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
                  src={hrProfileData?.profile_photo || profile}
                  alt="profile"
                  className="rounded-circle profile"
                  width={150}
                />
              </div>
              <h1 className="m-3 pt-3">{hrProfileData?.mantra}</h1>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3">
                    <h5>Full Name</h5>
                  </div>
                  <div className="col-md-9 text-secondary">
                    {hrProfileData?.first_name}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3">
                    <h5>Last Name</h5>
                  </div>
                  <div className="col-md-9 text-secondary">
                    {hrProfileData?.last_name}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3">
                    <h5>Contact</h5>
                  </div>
                  <div className="col-md-9 text-secondary">
                    {hrProfileData?.phone_contact}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3">
                    <h5>Email</h5>
                  </div>
                  <div className="col-md-9 text-secondary">
                    {hr?.email}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3">
                    <h5>Date of Birth</h5>
                  </div>
                  <div className="col-md-9 text-secondary">
                    {hrProfileData?.date_of_birth}
                  </div>
                </div>
              </div>
            </div>
            <div className="card mb-3 content">
              <h1 className="m-3 pt-3">Leave Approvals</h1>
              {hr?.leave_approvals.length !== 0 ? (
                hr?.leave_approvals.map((leave_approval) => (
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-3">
                        <h5>{leave_approval.name}</h5>
                      </div>
                      <div className="col-md-9 text-secondary">
                        {leave_approval.description}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <h5 className="text-secondary">No leaves have been set</h5>
              )}
            </div>
            <div className="card-footer">
        {/* Add the onClick event handler for the Edit Profile button */}
        <button type="update" className="btn btn-primary" onClick={handleEditButtonClick}>
          Edit Profile
        </button>
        <button type="update" className="btn btn-primary" onClick={handleResetPasswordButtonClick}>
          Reset Password
        </button>
      </div>
            {/* <div className="card mb-3 content">
              <h1 className="m-3 pt-3">Recent Payslip</h1>
              {manager?.remunerations.length !== 0 ? (
                manager?.remunerations.map((payslip) => (
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-3">
                        <h5>{payslip.name}</h5>
                      </div>
                      <div className="col-md-9 text-secondary">
                        {payslip.description}
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
              {manager?.leaves.length !== 0 ? (
                hrProfileData?.leaves.map((leave) => (
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
            </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
