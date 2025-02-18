import React, { useState, useEffect } from 'react';
import { retrieve } from "../Encryption";
import { useParams,useNavigate } from 'react-router-dom';
import EducationDocumentUpload from './EducationDocumentUpload';


const ViewEducation = () => {
  const [educations, setEducations] = useState([]);
  const [showAddEducation, setShowAddEducation] = useState(false);
  const { employeeId } = useParams();
  const navigate=useNavigate()

  useEffect(() => {
    fetch(`https://hrs-iymg.onrender.com/education/employee/${employeeId}`, {
      headers: {
        "Authorization": "Bearer " + retrieve().access_token
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch Education Details');
        }
        return response.json();
      })
      .then(data => {
        setEducations(data); 
      })
      .catch(error => {
        console.error('Error fetching education details:', error);
      });
  }, [setEducations]);

 
  const handleEducationClose =()=>{
    setShowAddEducation(false)
  }


  const handleUpdateEducation = (education) => {
    navigate(`/employee/update_education/${education.id}`);
  };

  const handleDeleteEducation =(educationId)=>{
    fetch(`https://hrs-iymg.onrender.com/education/${educationId}`, {
  method: "DELETE",
  headers: {
    Authorization: "Bearer " + retrieve().access_token,
  },
})
  .then((res) => {
    console.log("RES: ", res);
   
  })
  .then((data)=>{
    const updatedEducation = educations.filter(education => education.id !== educationId);
    setEducations(updatedEducation)
    
  })
  .catch((err) => {
    console.log(err);
    throw new Error(err);
  });
    
}
const handleAddEducation=()=>{
  navigate('/employee/add_education')
}

  return (
    <div className='content-wrapper' style={{ marginLeft: "280px", backgroundColor:"white", marginTop:"20px"}}>
      <h2>Education</h2>
      <table className='ui striped table' style={{ width: "1200px", marginLeft:"60px",marginBottom:"20px"}}>
        <thead>
          <tr>
            <th>Institution</th>
            <th>Course</th>
            <th>Qualification</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {educations.map(education => (
            <tr key={education.id}>
              <td>{education.institution}</td>
              <td>{education.course}</td>
              <td>{education.qualification}</td>
              <td>{new Date(education.start_date).toLocaleDateString()}</td>
              <td>{new Date(education.end_date).toLocaleDateString()}</td>
              <td>
                <button className='ui mini teal button' style={{ marginLeft:"10px"}}onClick={() => handleUpdateEducation(education)}>Update</button>
                <button className='ui mini teal button' style={{ marginLeft:"10px"}}onClick={() => handleDeleteEducation(education.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showAddEducation && <EducationDocumentUpload close={handleEducationClose} />}
     <div>
     <button className='ui teal button'style={{ width: "200px", marginLeft:"500px",marginTop:"60px"}} onClick={() =>handleAddEducation() }>Add Education</button>
     </div>
    </div>
  );
};

export default ViewEducation;
