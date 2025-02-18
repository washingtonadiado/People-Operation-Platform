import React, { useState, useEffect } from 'react';
import { retrieve } from '../Encryption';
import { useNavigate } from 'react-router-dom'; 

const EmployeeViewTrainings = () => {
  const [fetchedTrainings, setFetchedTrainings] = useState([]);
  const [newlyAppliedTrainings, setNewlyAppliedTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  const employeeId = retrieve().employee.id;

  useEffect(() => {
    const fetchTrainings = () => {
      fetch(`https://hrs-iymg.onrender.com/single_employee_trainings/${employeeId}`, {
        headers: {
          "Authorization": "Bearer " + retrieve().access_token
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch trainings');
          }
          return response.json();
        })
        .then(data => {
          setFetchedTrainings(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching trainings:', error);
          setLoading(false);
        });
    };

    fetchTrainings();
  }, [employeeId]);

  const handleApplyTraining = (appliedTraining) => {
    // setNewlyAppliedTrainings(prevState => [...prevState, appliedTraining]);
    navigate('/employee/view_trainings_employee')

  };

  const handleDeleteTraining = (trainingId) => {
    fetch(`https://hrs-iymg.onrender.com/delete_single_employee_trainings/${trainingId}`, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + retrieve().access_token,
        },
    })
    .then((res) => {
        if (!res.ok) {
            throw new Error('Failed to delete training');
        }
        // Filter out the deleted training from fetchedTrainings
        const updatedTrainings = fetchedTrainings.filter(training => training.id !== trainingId);
        setFetchedTrainings(updatedTrainings);
    })
    .catch((err) => {
        console.error(err);
        throw new Error(err);
    });
};








  return (
    <div className='content-wrapper' style={{ marginLeft: "280px", backgroundColor: "white", marginTop: "20px" }}>
      {loading && <div>Loading...</div>}
      {!loading && fetchedTrainings.length === 0 && newlyAppliedTrainings.length === 0 && <h3>Manager has not recommended any trainings for you.</h3>}
      {(fetchedTrainings.length > 0 || newlyAppliedTrainings.length > 0) && (
        <div>
          <h2 style={{ marginLeft: "450px"}}>Trainings</h2>
          <table className="ui striped table" style={{ width: "1200px", marginBottom: "20px" }}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Start Date</th>
                <th>Start Time</th>
                <th>End Date</th>
                <th>End Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fetchedTrainings.map((training, index) => (
                <tr key={index}>
                  <td>{training.title}</td>
                  <td>{training.description}</td>
                  <td>{training.start_date}</td>
                  <td>{training.start_time}</td>
                  <td>{training.end_date}</td>
                  <td>{training.end_time}</td>
                  <td>  <button className='ui mini teal button' style={{ marginLeft:"10px"}}onClick={() => handleDeleteTraining(training.id)}>Delete</button></td> {/* No action for fetched trainings */}

                </tr>
              ))}
              {newlyAppliedTrainings.map((training, index) => (
                <tr key={index}>
                  <td>{training.title}</td>
                  <td>{training.description}</td>
                  <td>{training.start_date}</td>
                  <td>{training.start_time}</td>
                  <td>{training.end_date}</td>
                  <td>{training.end_time}</td>
                  <td>
                <button className='ui mini teal button' style={{ marginLeft:"10px"}}onClick={() => handleDeleteTraining(index)}>Delete</button>
               
              </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button onClick={handleApplyTraining}>Apply for a training</button> 
    </div>
  );
};

export default EmployeeViewTrainings;
