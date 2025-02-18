import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { retrieve } from '../Encryption';

const RecommendTraining = () => {
  const [trainings, setTrainings] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { employeeId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableTrainings();
  }, []);

  const fetchAvailableTrainings = () => {
    fetch('https://hrs-iymg.onrender.com/available-trainings', {
      headers: {
        "Authorization": "Bearer " + retrieve().access_token,
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch available trainings');
        }
        return response.json();
      })
      .then(data => {
        setTrainings(data);
      })
      .catch(error => {
        setError(error.message);
      });
  };

  const handleRecommend = (trainingId) => {
    
    const isTrainingAssigned = trainings.some(training => training.id === trainingId && training.assigned_employee_id === employeeId);
    if (isTrainingAssigned) {
      setError('This training is already assigned to the employee.');
      return;
    }

    fetch('https://hrs-iymg.onrender.com/recommend-employee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + retrieve().access_token,
      },
      body: JSON.stringify({ employeeId, trainingId })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to recommend employee for training');
        }
        setSuccessMessage('Training successfully assigned!');
        
        setTimeout(() => {
          setSuccessMessage('');
        }, 15000);
        navigate('/manager/view_department_trainings')
       
        setTrainings(prevTrainings =>
          prevTrainings.map(training =>
            training.id === trainingId ? { ...training, assigned_employee_id: employeeId } : training
          )
        );
      })
      .catch(error => {
        setError(error.message);
      });
  };

  return (
    <div className='content-wrapper' style={{ marginLeft: "280px", backgroundColor: "white", marginTop: "20px" }}>
    {trainings.length === 0 ? (
      <p>No available trainings available for this employee.</p>
    ) : (
      <>
        <h3>Select a training to recommend for Employee ID: {employeeId}</h3>
        <table className='ui striped table' style={{ width: "1200px", marginLeft:"60px",marginBottom:"20px"}}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {trainings.map(training => (
              <tr key={training.id}>
                 
                <td>{training.title}</td>
                <td>{new Date(training.start_date).toLocaleDateString()}</td>
                <td>{training.start_time}</td>
                <td>{training.end_time}</td>
                <td>
                  <button className='ui teal button' style={{ width: "200px", marginLeft: "110px", marginTop: "20px" }}onClick={() => handleRecommend(training.id)}>Assign Training</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )}
  </div>
);
};

export default RecommendTraining;