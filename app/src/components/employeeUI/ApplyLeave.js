import React, { useState } from 'react';
import { retrieve } from "../Encryption";

const ApplyLeave = ({ onClose ,leaves,setLeaves}) => {
    const [startDate, setStartDate] = useState('');
    
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');
    const employeeId=retrieve().employee.id

    const handleSubmit = (e) => {
        e.preventDefault();

        const newLeave = {
            start_date: startDate,
            end_date: endDate,
            description: description
        };

        fetch('https://hrs-iymg.onrender.com/leaves', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + retrieve().access_token,
            },
            body: JSON.stringify(newLeave),
        })
            .then((resp) => resp.json())
            .then((data) => {
                console.log('New Leave Application:', data);
                setLeaves([...leaves, data])
                setEndDate("")
                setStartDate("")
                setDescription("")
                onClose(); // Close the form after submission
            })
            .catch((error) => {
                console.error('Error applying for leave:', error);
            });
    };

    const handleExit = () => {
        onClose(); 
    };

    return (
        <div className='content-wrapper' style={{ marginLeft: "10px", backgroundColor:"white", marginTop:"40px"}}>
            <h2 style={{ marginLeft:"410px",marginTop:"60px"}}>Apply for Leave</h2>
            <div className="ui equal width form" style={{ marginLeft:"250px",marginTop:"60px",width:"800px"}}>
                <form onSubmit={handleSubmit}>
                    <div className="twelve wide field">
                        <label>
                            Start Date:
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
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
                            Description:
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                        </label>
                        <br />
                    </div>
                    <br/>
                    <button type="submit" className="ui teal button" style={{ marginBottom: '20px', marginTop: '40px',width:"200px",marginLeft:"200px" }}>Submit</button>
                </form>
            </div>
            <div>
                <button className="mini ui teal button" style={{ marginLeft:"800px"}} onClick={handleExit}>Close</button>
            </div>
        </div>
    );
};

export default ApplyLeave;
