import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { retrieve } from "../Encryption";

const ViewTrainingsEmployee = () => {
    const [showCreateTraining, setShowCreateTraining] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [trainings, setTrainings] = useState([]);
    const [toDate, setToDate] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const employeeId = retrieve().employee.id;
    const [newlyAppliedTrainings, setNewlyAppliedTrainings] = useState([]);

    useEffect(() => {
        const fetchTrainings = () => {
            fetch(`https://hrs-iymg.onrender.com/filtered_single_employee_trainings/${employeeId}`, {
                headers: {
                    "Authorization": "Bearer " + retrieve().access_token,
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch trainings');
                    }
                    return response.json();
                })
                .then(data => setTrainings(data))
                .catch(error => console.error('Error fetching trainings:', error));
        };

        fetchTrainings();
    }, [employeeId]);

    useEffect(() => {
        if (location.state && location.state.newlyAppliedTrainings) {
            setNewlyAppliedTrainings(location.state.newlyAppliedTrainings);
        }
    }, [location]);

    const handleCreateTrainingClose = () => {
        setShowCreateTraining(false);
    };

    const handleApplyTraining = (training) => {
        fetch('https://hrs-iymg.onrender.com/apply_training', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + retrieve().access_token,
            },
            body: JSON.stringify({ trainingId: training.id }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to apply for training');
            }
            return response.json();
        })
        .then(data => {
        
            // setTrainings([data]);
            setNewlyAppliedTrainings(prevState => [...prevState, training]);
            // navigate(`/employee/view_trainings/${employeeId}`)
       
          
            
            navigate(`/employee/view_trainings/${employeeId}`, { state: { newlyAppliedTrainings: newlyAppliedTrainings } });
          
        })
        .catch(error => {
            console.error('Error applying for training:', error);
        });
    };

    const filteredTrainings = trainings.filter(training => {
        const startDate = new Date(training.start_date);
        const endDate = new Date(training.end_date);
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        if (from && startDate < from) return false;
        if (to && endDate > to) return false;

        return true;
    });

    return (
        <div className='content-wrapper' style={{ marginLeft: "280px", backgroundColor: "white", marginTop: "20px" }}>
            <h2 style={{ marginLeft: "500px", marginBottom: "50px" }}>Trainings</h2>
            <div style={{ marginLeft: "50px", marginBottom: "50px" }}>
                <label htmlFor="fromDate">From: </label>
                <input type="date" id="fromDate" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                <label htmlFor="toDate">To: </label>
                <input type="date" id="toDate" value={toDate} onChange={e => setToDate(e.target.value)} />
            </div>

            <table className='ui striped table' style={{ width: "1200px", marginLeft: "60px", marginBottom: "20px" }}>
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
                    {filteredTrainings.map(training => (
                        <tr key={training.id}>
                            <td>{training.title}</td>
                            <td>{training.description}</td>
                            <td>{training.start_date}</td>
                            <td>{training.start_time}</td>
                            <td>{training.end_date}</td>
                            <td>{training.end_time}</td>
                            <td>
                                <button className='ui mini teal button' style={{ marginLeft: "10px" }} onClick={() => handleApplyTraining(training)}>Apply for this Training</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewTrainingsEmployee;
