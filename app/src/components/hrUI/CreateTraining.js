import React, { useState } from 'react';
import { retrieve } from "../Encryption"

const CreateTraining = ({ trainings, setTrainings, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const newTraining = {
            title,
            description,
            start_date: startDate,
            start_time: startTime + ":00",
            end_date: endDate,
            end_time: endTime + ":00",
        };

        fetch('https://hrs-iymg.onrender.com/trainings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + retrieve().access_token,
            },
            body: JSON.stringify(newTraining),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log('New Training:', data);
                setTrainings([...trainings, data]);

                setTitle('');
                setDescription('');
                setStartDate('');
                setStartTime('');
                setEndDate('');
                setEndTime('');
                onClose()
            })
            .catch((error) => {
                console.error('Error creating training:', error);
            });
    };

    const handleExit = () => {
        onClose();
    };

    return (
        <div className='content-wrapper' style={{ marginLeft: "10px", backgroundColor: "white", marginTop: "40px" }}>
            <h2 style={{ marginLeft: "480px", marginTop: "60px" }}>Add Training</h2>
            <div className="ui equal width form" style={{ marginLeft: "250px", marginTop: "60px", width: "900px" }}>
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className="twelve wide field">
                            <label>
                                Title:
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </label>
                        </div>
                        <br />
                        <div className="twelve wide field">
                            <label>
                                Description:
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                            </label>
                        </div>
                        <br />
                        <div className="twelve wide field">
                            <label>
                                Start Date:
                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                            </label>
                        </div>
                        <br />
                        <div className="twelve wide field">
                            <label>
                                Start Time:
                                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                            </label>
                        </div>
                        <br />
                        <div className="twelve wide field">
                            <label>
                                End Date:
                                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                            </label>
                        </div>
                        <br />
                        <div className="twelve wide field">
                            <label>
                                End Time:
                                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                            </label>
                        </div>
                        <br />
                        <button type="submit" className="ui teal button" style={{ marginBottom: '20px', marginTop: '40px', marginLeft: "200px",width:"200px" }}>Create Training</button>
                    </form>
                </div>
            </div>
            <button className="mini ui teal button" style={{ marginLeft: "950px" }} onClick={handleExit}>Exit</button>
        </div>
    );
};

export default CreateTraining;
