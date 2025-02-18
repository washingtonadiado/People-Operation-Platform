import React, { useState, useEffect } from 'react';
import { retrieve } from '../Encryption';
import { useNavigate } from 'react-router-dom';
import AddDepartment from './AddDepartment';

const Departments = () => {

  const [departments, setDepartments] = useState([]);
  const [showCreateDepartment, setShowCreateDepartment] = useState(false);

//   const departmentId=retrieve().manager.dept_id
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://hrs-iymg.onrender.com/departments')
      .then(response => response.json())
      .then(data => setDepartments(data))
      .catch(error => console.error('Error fetching departments:', error));
  }, []);

  const handleUpdate = (id) => {
    navigate(`/manager/update_departments/${id}`);
  };
  const handleCreateDepartmentClose = () => {
    setShowCreateDepartment(false);
};

  const handleDelete = (departmentId) => {
    fetch(`https://hrs-iymg.onrender.com/departments/${departmentId}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + retrieve().access_token,
        },
      })
        .then((res) => {
          console.log("RES: ", res);
        })
        .then((data)=>{
          const updatedDepartments = departments.filter(department => department.id !== departmentId);
          setDepartments(updatedDepartments)
        })
        .catch((err) => {
          console.log(err);
          throw new Error(err);
        });
  };


  return (
    <div className='content-wrapper' style={{ marginLeft: "280px", backgroundColor: "white", marginTop: "20px" }}>
      <h1  style={{marginLeft:"270px",marginBottom:"20px",marginTop:"20px"}}>Departments</h1>
      <table className='ui striped table' style={{ width: "600px", marginLeft:"60px",marginBottom:"20px"}}>
        <thead>
          <tr>
            <th>Department Name</th>
            <th>Actions</th> {/* New column for actions */}
          </tr>
        </thead>
        <tbody>
          {departments.map(department => (
            <tr key={department.id}>
              <td>{department.name}</td>
              <td>
                <button className='ui mini teal button' style={{ marginLeft:"10px"}}  onClick={() => handleUpdate(department.id)}>Update</button>
                <button className='ui mini teal button' style={{ marginLeft:"10px"}}  onClick={() => handleDelete(department.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
      {showCreateDepartment && <AddDepartment onClose={handleCreateDepartmentClose} departments={departments} setDepartments={setDepartments} />}
      <button className='ui teal button' style={{ width: "200px", marginLeft: "200px", marginTop: "20px" }}onClick={() => setShowCreateDepartment(true)}>Add Department</button>
      </div>
    </div>
  );
};

export default Departments;
