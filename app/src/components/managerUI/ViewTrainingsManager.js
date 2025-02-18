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
        navigate(`/update_trainings/${training.id}`);
    };

    const handleDeleteTraining = (trainingId) => {
        fetch(`https://hrs-iymg.onrender.com/trainings/${trainingId}`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + retrieve().access_token,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                const updatedTrainings = trainings.filter(training => training.id !== trainingId);
                setTrainings(updatedTrainings);
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

    return (
        <div className='content-wrapper' style={{ marginLeft: "280px", backgroundColor: "white", marginTop: "20px" }}>
            <h2>Trainings</h2>
            <div>
                <label htmlFor="fromDate">From: </label>
                <input type="date" id="fromDate" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                <label htmlFor="toDate">To: </label>
                <input type="date" id="toDate" value={toDate} onChange={e => setToDate(e.target.value)} />
            </div>

            {filteredTrainings.length === 0 ? (
                <p>No trainings available</p>
            ) : (
                <table>
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
                                    <button onClick={() => handleUpdateTraining(training)}>Update</button>
                                    <button onClick={() => handleDeleteTraining(training.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {showCreateTraining && <CreateTraining onClose={handleCreateTrainingClose} trainings={trainings} setTrainings={setTrainings} />}
            <button onClick={() => setShowCreateTraining(true)}>Add Training</button>
        </div>
    );
};

export default ViewTrainings;
