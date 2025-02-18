import React, { useState, useEffect } from 'react';
import { retrieve } from "../Encryption";

const ViewStaffDetails = () => {
  const [staffDetails, setStaffDetails] = useState([]);

  useEffect(() => {
    fetch('https://hrs-iymg.onrender.com/employees_details')
      .then(response => response.json())
      .then(data => {
        const employees = data.map(employee => ({ ...employee, type: 'Employee' }));
        setStaffDetails(employees);
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
      });
  }, []);

  return (
    <div className='content-wrapper' style={{ marginLeft: "280px", backgroundColor:"white", marginTop:"20px"}}>
      <h2 style={{ marginLeft:"500px", marginBottom:"50px"}}>Employees Details</h2>
      <table className='ui striped table' style={{ width: "1200px", marginLeft:"60px",marginBottom:"20px"}}>
        <thead>
          <tr>
            <th>Personal Number</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Title</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {staffDetails.map(staff => (
            <tr key={staff.id}>
              <td>{staff.personal_no}</td>
              <td>{staff.employee_first_name || staff.manager_first_name || staff.hr_first_name}</td>
              <td>{staff.employee_last_name || staff.manager_last_name || staff.hr_last_name}</td>
              <td>{staff.employee_title || staff.manager_title || staff.hr_title}</td>
              <td>{staff.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewStaffDetails;
