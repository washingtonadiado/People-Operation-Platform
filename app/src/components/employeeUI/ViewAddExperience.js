import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { retrieve } from "../Encryption";
import './Experience.css';
import { useNavigate } from "react-router-dom";

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

const ViewExperience = () => {
    const [experiences, setExperiences] = useState([]); // Changed initial state to an empty array
    const [message, setMessage] = useState(''); 
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('https://hrs-iymg.onrender.com/employee_experiences', {
            headers: {
                'Authorization': `Bearer ${retrieve().access_token}`
            }
        })
        .then(res => {
            const formattedExperiences = res.data.map(exp => ({
                ...exp,
                start_date: formatDate(exp.start_date),
                end_date: formatDate(exp.end_date)
            }));
            setExperiences(formattedExperiences);
        })
        .catch(err => {
            console.error(err);
        });
    }, []);

    const handleChange = (e, index) => {
        const updatedExperiences = [...experiences];
        updatedExperiences[index][e.target.name] = e.target.value;
        setExperiences(updatedExperiences);
    };

    const handleSubmit = e => {
        e.preventDefault();
        const newExperience = experiences[experiences.length - 1];
        newExperience.start_date = formatDateForBackend(newExperience.start_date);
        newExperience.end_date = formatDateForBackend(newExperience.end_date);
        axios.post('https://hrs-iymg.onrender.com/experiences', newExperience, {
            headers: {
                'Authorization': `Bearer ${retrieve().access_token}`
            }
        })
        .then(res => {
            setExperiences(prevExperiences => [...prevExperiences, res.data]);
            setExperiences(prevExperiences => [...prevExperiences, {
                name: '',
                job_title: '',
                description: '',
                start_date: '',
                end_date: ''
            }]);
            setMessage('Experience added successfully!'); 
        })
        .catch(err => {
            console.error(err);
            setMessage('Error adding experience.'); 
        });
    };

    const handleUpdate = (event, id) => {
        event.preventDefault();
        navigate(`/employee/update-experience/${id}`);
    };

    const handleDelete = (event, id) => {
        event.preventDefault();
        axios.delete(`https://hrs-iymg.onrender.com/experiences/${id}`, {
            headers: {
                'Authorization': `Bearer ${retrieve().access_token}`
            }
        })
        .then(res => {
            setExperiences(experiences.filter(exp => exp.id !== id));
            setMessage('Experience deleted successfully!');
        })
        .catch(err => {
            console.error(err);
            setMessage('Error deleting experience.'); 
        });
    };

    const addExperience = () => {
        setExperiences([...experiences, {
            name: '',
            job_title: '',
            description: '',
            start_date: '',
            end_date: ''
        }]);
    };

    return (
        <div style={{ marginLeft: "280px", backgroundColor:"white", marginTop:"20px"}}>
            <form onSubmit={handleSubmit}>
                <div className="experience">
                    <div className="experience-row">
                        <div className="experience-cell">Name</div>
                        <div className="experience-cell">Job Title</div>
                        <div className="experience-cell">Description</div>
                        <div className="experience-cell">Start Date</div>
                        <div className="experience-cell">End Date</div>
                        <div className="experience-cell">Actions</div>
                    </div>
                    {experiences.slice(0, -1).map((experience, index) => (
                        <div key={index} className="experience-row">
                            <div className="experience-cell">{experience.name}</div>
                            <div className="experience-cell">{experience.job_title}</div>
                            <div className="experience-cell">{experience.description}</div>
                            <div className="experience-cell">{experience.start_date}</div>
                            <div className="experience-cell">{experience.end_date}</div>
                            <div className="experience-cell">
                                <button type="button" className="update-button" onClick={(event) => handleUpdate(event, experience.id)}>Update</button>
                                <button type="button" className="delete-button" onClick={(event) => handleDelete(event, experience.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                    {experiences.length > 0 && (
                        <div className="experience-row">
                            <div className="experience-cell">
                                <input type="text" name="name" value={experiences[experiences.length - 1].name} onChange={e => handleChange(e, experiences.length - 1)} placeholder="Name" required />
                            </div>
                            <div className="experience-cell">
                                <input type="text" name="job_title" value={experiences[experiences.length - 1].job_title} onChange={e => handleChange(e, experiences.length - 1)} placeholder="Job Title" required />
                            </div>
                            <div className="experience-cell">
                                <textarea name="description" value={experiences[experiences.length - 1].description} onChange={e => handleChange(e, experiences.length - 1)} placeholder="Description" required />
                            </div>
                            <div className="experience-cell">
                                <label>
                                    <input type="date" name="start_date" value={experiences[experiences.length - 1].start_date} onChange={e => handleChange(e, experiences.length - 1)} required />
                                </label>
                            </div>
                            <div className="experience-cell">
                                <label>
                                    <input type="date" name="end_date" value={experiences[experiences.length - 1].end_date} onChange={e => handleChange(e, experiences.length - 1)} required />
                                </label>
                            </div>
                            <div className="experience-cell"></div>
                        </div>
                    )}
                </div>
                <button type="button" className="add-button" onClick={addExperience}>Add Another Experience</button>
                <button type="submit" className="submit-button">Submit</button>
            </form>
            {message && <p>{message}</p>} 
        </div>
    );
};

export default ViewExperience;
