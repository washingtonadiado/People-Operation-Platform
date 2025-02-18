import React, { useState, useEffect } from 'react';
import CreateTraining from './CreateTraining';
import { useNavigate, useParams } from 'react-router-dom';
import UpdateTrainings from './UpdateTrainings';
import { retrieve } from "../Encryption";

const ViewTrainings = ({ trainings, setTrainings }) => {
    const [showCreateTraining, setShowCreateTraining] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchTrainings = () => {
            fetch('https://hrs-iymg.onrender.com/trainings', {
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
    }, [setTrainings]);

    const handleCreateTrainingClose = () => {
        setShowCreateTraining(false);
    };

    const handleUpdateTraining = (training) => {
        navigate(`/hr/update_trainings/${training.id}`);
    };

    const handleDeleteTraining = (trainingId) => {
        fetch(`https://hrs-iymg.onrender.com/trainings/${trainingId}`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + retrieve().access_token,
            },
        })
            .then((res) => {
                console.log("RES: ", res);

            })
            .then((data) => {
                const updatedTrainings = trainings.filter(training => training.id !== trainingId);
                setTrainings(updatedTrainings)

            })
            .catch((err) => {
                console.log(err);
                throw new Error(err);
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

    const handleAddTraining = () => {
        setShowCreateTraining(true);
    };

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
                                <button className='ui mini teal button' style={{ marginLeft: "10px" }} onClick={() => handleUpdateTraining(training)}>Update</button>
                                <button className='ui mini teal button' style={{ marginLeft: "10px" }} onClick={() => handleDeleteTraining(training.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showCreateTraining && <CreateTraining onClose={handleCreateTrainingClose} trainings={trainings} setTrainings={setTrainings} />}
            <button className='ui teal button' style={{ width: "200px", marginLeft: "500px", marginTop: "60px", display: showCreateTraining ? 'none' : 'block' }} onClick={handleAddTraining}>Add Training</button>
        </div>
    );
};

export default ViewTrainings;
