import React, { useState, useEffect } from 'react';
import { retrieve } from "../Encryption";
import { useNavigate } from 'react-router-dom';
import ApplyLeave from './ApplyLeave';

const ViewLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [showAddLeave, setShowAddLeave] = useState(false); // Initialize to false
  const navigate = useNavigate();
  const today = new Date();
  const employee_id = retrieve().employee.id;

  useEffect(() => {
    const fetchLeaves = () => {
      fetch(`https://hrs-iymg.onrender.com/employee_leaves/${employee_id}`, {
        headers: {
          "Authorization": "Bearer " + retrieve().access_token
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch Leaves');
          }
          return response.json();
        })
        .then(data => {
          setLeaves(data);
        })
        .catch(error => {
          console.error('Error fetching leaves:', error);
        });
    };

    fetchLeaves();
  }, []);

  const handleUpdateLeave = (leave) => {
    navigate(`/employee/update_leave/${leave.id}`);
  };

  const handleDeleteLeave = (leaveId) => {
    fetch(`https://hrs-iymg.onrender.com/leaves/${leaveId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + retrieve().access_token,
      },
    })
      .then((res) => {
        console.log("RES: ", res);

        setLeaves(leaves.filter(leave => leave.id !== leaveId));
      })
      .catch((err) => {
        console.log(err);
        throw new Error(err);
      });
  };

  const handleViewLeave = (leave) => {
    navigate(`employee/leave/${leave.id}`);
  };

  const showButtons = (leave) => {
    return !leave.approved;
  };

  const handleAddLeaveClose = () => {
    setShowAddLeave(false); 
  };

  return (
    <div className='content-wrapper' style={{ marginLeft: "280px", backgroundColor:"white", marginTop:"20px"}}>
      <h2 style={{ marginLeft: "450px"}}>Leave Applications</h2>
      <table className='ui striped table' style={{ width: "1200px", marginLeft:"60px",marginBottom:"20px"}}>
        <thead>
          <tr>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Description</th>
            <th>Approved</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map(leave => (
            <tr key={leave.id}>
             <td>{new Date(leave.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
             <td>{new Date(leave.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
              <td>{leave.description}</td>
              <td>{leave.approved ? 'Yes' : 'No'}</td>
              <td>
                {showButtons(leave) && (
                  <>
                    <button className='ui mini teal button' style={{ marginLeft:"10px"}} onClick={() => handleUpdateLeave(leave)}>Update</button>
                    <button className='ui mini teal button' style={{ marginLeft:"10px"}} onClick={() => handleDeleteLeave(leave.id)}>Delete</button>
                  </>
                )}
                {/* <button onClick={() => handleViewLeave(leave)} disabled={!showButtons(leave)}>View</button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!showAddLeave && <button className='ui teal button'style={{ width: "200px", marginLeft:"500px",marginTop:"60px"}} onClick={() => setShowAddLeave(true)}>Apply for Leave</button>}
      {showAddLeave && <ApplyLeave onClose={handleAddLeaveClose} leaves={leaves} setLeaves={setLeaves} />}
    </div>
  );
};

export default ViewLeaves;
