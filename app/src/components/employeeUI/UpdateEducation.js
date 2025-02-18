import React, { useState, useEffect } from 'react';
import { retrieve } from '../Encryption';

const UpdateDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [updatedDepartments, setUpdatedDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://hrs-iymg.onrender.com/department_heads', {
      headers: {
        Authorization: "Bearer " + retrieve().access_token,
      },
    })
      .then(response => response.json())
      .then(data => {
        setDepartments(data);
        setUpdatedDepartments([...data]); 
        setLoading(false);
      })
      .catch(error => console.error('Error fetching departments:', error));
  }, []);

  const handleDepartmentNameChange = (e, index) => {
    const updated = [...updatedDepartments];
    updated[index].name = e.target.value;
    setUpdatedDepartments(updated);
  };

  const handleManagerNameChange = (e, index) => {
    const updated = [...updatedDepartments];
    if (updated[index].manager) {
      updated[index].manager.profile.first_name = e.target.value;
      setUpdatedDepartments(updated);
    }
  };

  const handleManagerEmailChange = (e, index) => {
    const updated = [...updatedDepartments];
    if (updated[index].manager) {
      updated[index].manager.email = e.target.value;
      setUpdatedDepartments(updated);
    }
  };

  const handleSubmit = (index) => {
    const updated = [...updatedDepartments];
    updateDepartment(updated[index]);
  };

  const updateDepartment = (updatedDepartment) => {
    // Here you can send the updated department to the backend
    // For demonstration, we're just logging it
    console.log(updatedDepartment);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='content-wrapper' style={{ marginLeft: "280px", backgroundColor: "white", marginTop: "20px" }}>
      <div>
        <h1  style={{ marginLeft: "420px"}}>Update Departments</h1>
      </div>
      <table className='ui striped table' style={{ width: "1200px", marginLeft:"60px",marginBottom:"20px"}}>
        <thead>
          <tr>
            <th>Department Name</th>
            <th>Manager Name</th>
            <th>Manager Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {updatedDepartments.map((department, index) => (
            <tr key={index}>
              <td>
                <input type="text" value={department.name} onChange={(e) => handleDepartmentNameChange(e, index)} />
              </td>
              <td>
                <input type="text" value={department.manager ? department.manager.profile.first_name : ''} onChange={(e) => handleManagerNameChange(e, index)} />
              </td>
              <td>
                <input type="text" value={department.manager ? department.manager.email : ''} onChange={(e) => handleManagerEmailChange(e, index)} />
              </td>
              <td>
                <button onClick={() => handleSubmit(index)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpdateDepartments;
