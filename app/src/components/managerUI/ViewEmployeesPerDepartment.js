import React, { useState, useEffect } from 'react';
import { retrieve } from '../Encryption';

const ViewEmployeesPerDepartment = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const deptId=retrieve().manager.dept_id

  useEffect(() => {
   
    fetch(`https://hrs-iymg.onrender.com/employees_department/${deptId}`, {
        headers: {
          "Authorization": "Bearer " + retrieve().access_token,
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(data => {
        setEmployees(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='content-wrapper' style={{ marginLeft: "280px", backgroundColor:"white", marginTop:"20px"}}>
      <h2 style={{marginLeft:"440px",marginBottom:"20px",marginTop:"20px"}}>Staff in my Department</h2>
      <table className='ui striped table' style={{ width: "1200px", marginLeft:"60px",marginBottom:"20px"}}>
        <thead>
          <tr>
            <th>Staff No</th>
          
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone Contact</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.personal_no}</td>
              
              <td>{employee.first_name}</td>
              <td>{employee.last_name}</td>
              <td>{employee.email}</td>
              <td>{employee.phone_contact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewEmployeesPerDepartment;