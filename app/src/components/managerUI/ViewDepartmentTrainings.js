import React, { useState, useEffect } from 'react';
import { retrieve } from '../Encryption';
import { useNavigate } from 'react-router-dom';

function ViewDepartmentTrainings() {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState(null);
    const managerId = retrieve().manager.id;
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`https://hrs-iymg.onrender.com/manager/employees/${managerId}`, {
            headers: {
                Authorization: "Bearer " + retrieve().access_token,
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('You have no Team members');
            }
            return response.json();
        })
        .then(data => {
            setEmployees(data); 
        })
        .catch(error => {
            setError(error.message);
        });
    }, [managerId]); 

    const handleRecommend = (employeeId) => {
        navigate(`/manager/recommend_training/${employeeId}`);
        console.log(`Employee ${employeeId} recommended for training`);
    };

    

    return (
        <div className='content-wrapper' style={{ marginLeft: "280px", backgroundColor:"white", marginTop:"20px"}}>
            <h1 style={{marginLeft:"370px",marginBottom:"20px",marginTop:"20px"}}>Training for my Department Staff </h1>
            {error && <p>{error}</p>}
            <table className='ui striped table' style={{ width: "1200px", marginLeft:"60px",marginBottom:"20px"}}>
                <thead>
                    <tr> <th>Staff No</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Assigned Trainings</th>
                        <th>Recommend for Training</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(employee => (
                        <tr key={employee.id}>
                            <td>{employee.personal_no}</td>
                            <td>{employee.first_name}</td>
                            <td>{employee.last_name}</td>
                            <td>{employee.email}</td>
                            <td>
                                <ul>
                                    {employee.assigned_trainings.map(training => (
                                      
                                        <li key={training.id}>
                                            {training.id} {training.title} - {training.start_date} to {training.end_date}, {training.start_time} to {training.end_time}
                                         
                                           
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                <button className='ui mini teal button'onClick={() => handleRecommend(employee.id)}>Recommend More Training</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ViewDepartmentTrainings;
