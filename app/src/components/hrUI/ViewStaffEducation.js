import React, { useState, useEffect } from 'react';
import { retrieve } from '../Encryption';

const ViewStaffEducation = () => {
  const [educationDetails, setEducationDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://hrs-iymg.onrender.com/staff_education',{
        headers: {
            Authorization: "Bearer " + retrieve().access_token,
        },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch education details');
        }
        return response.json();
      })
      .then(data => {
        setEducationDetails(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='content-wrapper' style={{ marginLeft: "280px", backgroundColor:"white", marginTop:"20px"}}>
      <h2 style={{ marginLeft:"500px", marginBottom:"50px"}}> Staff Education Details</h2>
      <table className='ui striped table' style={{ width: "1200px", marginLeft:"60px",marginBottom:"20px"}}>
        <thead>
          <tr>
            <th>Staff No</th>
       
            <th>First Name</th>
            <th>Last Name</th>
            <th>Institution</th>
            <th>Course</th>
            <th>Qualification</th>
            <th>Start Date</th>
            <th>End Date</th>
           
          </tr>
        </thead>
        <tbody>
          {educationDetails.map(education => (
            <tr key={education.id}>
              <td>{education.personal_no}</td>
            
              <td>{education.first_name}</td>
              <td>{education.last_name}</td>
              <td>{education.institution}</td>
              <td>{education.course}</td>
              <td>{education.qualification}</td>
              <td>{education.start_date}</td>
              <td>{education.end_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewStaffEducation;
