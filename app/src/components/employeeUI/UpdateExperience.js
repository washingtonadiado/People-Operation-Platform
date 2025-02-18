import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { retrieve } from "../Encryption";
import './Experience.css';
import { useParams, useNavigate } from "react-router-dom";

// formats the date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const formatDateForBackend = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
};

const UpdateExperience = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [experience, setExperience] = useState({
        name: '',
        job_title: '',
        description: '',
        start_date: '',
        end_date: ''
    });
    const [message, setMessage] = useState(''); 

    useEffect(() => {
        axios.get(`https://hrs-iymg.onrender.com/experiences/${id}`, {
            headers: {
                'Authorization': `Bearer ${retrieve().access_token}`
            }
        })
        .then(res => {
            const formattedExperience = {
                ...res.data,
                start_date: formatDate(res.data.start_date),
                end_date: formatDate(res.data.end_date)
            };
            setExperience(formattedExperience);
        })
        .catch(err => {
            console.error(err);
        });
    }, [id]);

    const handleChange = (e) => {
        setExperience({
            ...experience,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = (event) => {
        event.preventDefault();
        const updatedExperience = {
            ...experience,
            start_date: formatDateForBackend(experience.start_date),
            end_date: formatDateForBackend(experience.end_date)
        };
        axios.patch(`https://hrs-iymg.onrender.com/experiences/${id}`, updatedExperience, {
            headers: {
                'Authorization': `Bearer ${retrieve().access_token}`
            }
        })
        .then(res => {
            setMessage('Experience updated successfully!');
            navigate('/employee/view_experience');
        })
        .catch(err => {
            console.error(err);
            setMessage('Error updating experience.'); 
        });
    };

    return (
        <div style={{ marginLeft: "280px", backgroundColor:"white", marginTop:"20px"}}>
            <form onSubmit={handleUpdate}>
                <div className="experience">
                    <input type="text" name="name" value={experience.name} onChange={handleChange} placeholder="Name" required />
                    <input type="text" name="job_title" value={experience.job_title} onChange={handleChange} placeholder="Job Title" required />
                    <textarea name="description" value={experience.description} onChange={handleChange} placeholder="Description" required />
                    <label>
                        Start Date:
                        <input type="date" name="start_date" value={experience.start_date} onChange={handleChange} required />
                    </label>
                    <label>
                        End Date:
                        <input type="date" name="end_date" value={experience.end_date} onChange={handleChange} required />
                    </label>
                    <button type="submit" className="submit-button">Update</button>
                </div>
            </form>
            {message && <p>{message}</p>} 
        </div>
    );
};

export default UpdateExperience;

