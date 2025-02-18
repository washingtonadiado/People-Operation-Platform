import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { retrieve } from "./Encryption";
import './resetPassword.css'



const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();
  

  const handleRoleChange = (e) => {
    console.log("Selected Role:", e.target.value);
    setSelectedRole(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, newPassword: newPassword, role: selectedRole, confirmPassword: confirmPassword }),
      };

      const response = await fetch("https://hrs-iymg.onrender.com/forgot_password", requestOptions);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Password reset request failed:", errorData.message);

        // Check if the error is due to user not found
        if (errorData.message === "user not found") {
          alert("The provided email address does not match any user in the system. Please check the email address and try again.");
        }

        return;
      }

      console.log("Password reset successfully");
      console.log(newPassword)
      navigate("/login"); // Redirect to login page or a success page
    } catch (error) {
      console.error("Error during password reset:", error);
    }
  };
    

    

  return (
    <div className="Reset-Passowrd"> 
      <nav className="main-nav">
          <div className="nav-logo">
            <a href="#">HRS.io</a>
          </div>
          <ul className="nav-list-login">
            <Link className="link" to={"/"}>Home</Link>
          </ul>
        </nav>
        <div className="Reset-password-Content">
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit} className="Reset-Passowrd-Form">
                <div className="Email-Card">
                <label>Email:</label>
                <input type="email" value={email} onChange={handleEmailChange} required />
                </div>
                <div className="New-Password-Card">
                <label>New Password:</label>
                <input type="password" value={newPassword} onChange={handleNewPasswordChange} required />
                </div>
                <div className="Confirm-Password-Card">
                <label>Confirm Password:</label>
                <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} required />
                </div>
                <div className="form-group_login">
                <label htmlFor="roleDropdown">Role</label>
                <select
                  className="form-control"
                  id="roleDropdown"
                  onChange={handleRoleChange}
                >
                  <option value="">Select a role</option>
                  <option value={"manager"}>Manager</option>
                  <option value={"employee"}>Employee</option>
                  <option value={"hr"}>HR</option>
                </select>
              </div>
                <button className="Reset-Password" type="submit">Reset Password</button>
            </form>
         </div>
    </div>
    
  );
};

export default ResetPassword;