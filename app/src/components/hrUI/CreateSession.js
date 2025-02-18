import React, { useState, useEffect } from 'react';
import {retrieve} from "../Encryption"
import './createSession.css'

const CreateSession = ({sessions, setSessions, onClose}) => {
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();

        const newSession = {
            name: name,
            start_date: startDate,
            end_date: endDate,

        };

        fetch('https://hrs-iymg.onrender.com/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + retrieve().access_token,
            },
            body: JSON.stringify(newSession),
        })
        .then((resp) => {
            if (!resp.ok) {
                throw new Error(`HTTP error! Status: ${resp.status}`);
            }
            return resp.json();
        })
        .then((data) => {
            console.log('New Session:', data);
            setSessions([...sessions, data]);
            setName('');
            setStartDate('');
            setEndDate('');
            onClose();
        })
        .catch((error) => {
            console.error('Error creating session:', error);
        });

    }

    const handleExit = () => {
        onClose();
    };

  return (
    <div className="create-session-container">
        <h3>Add Sesion</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </label>
                <br />
                <label>
                    Start Date:
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                </label>
                <br />
                <label>
                    End Date:
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                </label>
                <br />
                <button type="submit">Create Session</button>
            </form>
            <button className="exit-button" onClick={handleExit}>Exit</button>
    </div>
  )
}

export default CreateSession