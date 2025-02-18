import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { store, retrieve } from "./Encryption";
import './login.css'


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRoleChange = (e) => {
    console.log("Selected Role:", e.target.value);
    setSelectedRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const credentials = {
      email: email,
      password: password,
      role: selectedRole,

    };
    console.log("Login request data:", credentials);

    

    fetch("https://hrs-iymg.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => {
        console.log("Server response status:", response.status);
        if (response.ok) {
          return response.json();
        } else {
          console.error("Login failed");
          throw new Error("Login failed");
        }
      })
      .then((result) => {
        // Check the role and access token from the response
        store(result);
        const { role } = result;
        console.log(result)

        localStorage.setItem(
          "accessToken",
          JSON.stringify(result.access_token)
        );
     
      
        // Redirect the user based on their role
        switch (selectedRole) {
          case "manager":
            navigate(`/manager/manager_profile`);
            break;
          case "employee":
            navigate("/employee/profile");

            break;
          case "hr":
            navigate(`/hr/hr_profile`);
            break;
          default:
            console.error("Unknown role:", role);
        }

        console.log("Login successful!");
        console.log()
      })
      .catch((error) => {
       
        setLoading(false);
        setError('Invalid Email or Password: Please try again.');
        console.error('Error while signing in:', error);
      });
  };

  
  return (
      
      <div className="main_container_login" style={{ marginRight:"20px" }} >
      <nav className="main-nav">
          <div className="nav-logo">
            <a href="#">HRS.io</a>
          </div>
          <ul className="nav-list-login">
            <Link className="link" to={"/"}>Home</Link>
          </ul>
        </nav>
      <div className="ui_column_login">
      <h1 style={{ textAlign: "center" , marginBottom:"30px"}}>Login Form</h1>    
      <div className="ui_centered_card " style={{ width: "400px" }}>
      
      <div className="loginForm_container" style={{ margin: "20px", textAlign: "center" }}>
             
                  <form onSubmit={handleSubmit}>
                      <div className="form-group_login">
                        <label htmlFor="exampleInputEmail1">
                          Email address
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="exampleInputEmail1"
                          placeholder="Enter email"
                          value={email}
                          onChange={handleEmailChange}
                        />
                      </div>
                      <div className="form-group_login">
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="exampleInputPassword1"
                          placeholder="Password"
                          value={password}
                          onChange={handlePasswordChange}
                        />
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

                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="exampleCheck1"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="exampleCheck1"
                        >
                          Remember Me
                        </label>
                      </div>
                
                    <div className="login_button">
                      <button type="submit" className="ui teal button" style={{ marginTop: "20px", textAlign: "center" }}>
                      {loading ? 'Loading...' : 'Login'}
                      </button>
                      {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>
                    <div style={{ marginTop: "10px" }}>
                      <a href="/reset_password">Forgot Password?</a>
                    </div>
                  </form>
                
              </div>
          
              </div>
     </div>
  
    </div>
    
    
    
  );
};

export default Login;
