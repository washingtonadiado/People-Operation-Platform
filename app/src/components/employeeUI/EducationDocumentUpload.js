import React, { useState } from 'react';
import { retrieve } from "../Encryption";
import { useNavigate} from 'react-router-dom';

const EducationDocumentUpload = () => {
 
  const [educationDetails, setEducationDetails] = useState({
    institution: '',
    course: '',
    qualification: '',
    start_date: '',
    end_date: ''
  });
 const navigate =useNavigate()

  const [document, setDocument] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('official');
  const employeeId=retrieve().employee.id


  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setEducationDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDocumentChange = (e) => {
    setDocument(e.target.files[0]);
    setDocumentName(e.target.files[0].name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    fetch('https://hrs-iymg.onrender.com/education', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + retrieve().access_token,
      },
      body: JSON.stringify(educationDetails)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(educationData => {
      const formData = new FormData();
      formData.append('document', document);
      formData.append('name', documentName);
      formData.append('type', documentType);
  
      fetch(`https://hrs-iymg.onrender.com/upload/${educationData.id}`, {
        method: 'POST',
        headers: {
          "Authorization": "Bearer " + retrieve().access_token,
        },
        body: formData
      });
    })
 
    .then(documentData => {
      console.log('Document upload response:', documentData);
      navigate(`/employee/view_education/${employeeId}`)
     
  
      setEducationDetails({
        institution: '',
        course: '',
        qualification: '',
        start_date: '',
        end_date: ''
      });
      setDocument(null);
      setDocumentName('');
      setDocumentType('official');
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };
  



  return (
    <div className='content-wrapper' style={{ marginLeft: "280px", backgroundColor:"white", marginTop:"20px"}}>
      <h2 style={{ marginLeft:"570px",marginTop:"60px"}}>Add Education</h2>
      
      <div className="ui equal width form" style={{ marginLeft:"450px",marginTop:"60px"}} >
        <div>
      <form onSubmit={handleSubmit}>
        <div className="eight wide field">
        <label>
          Institution:
          <input type="text" name="institution" value={educationDetails.institution} onChange={handleEducationChange} required />
        </label>
        </div>
        <br />
        <div className="eight wide field">
        <label>
          Course:
          <input type="text" name="course" value={educationDetails.course} onChange={handleEducationChange} required />
        </label>
        </div>
        <br />
      <div className="eight wide field" >
        <label>
          Qualification:
          <input type="text" name="qualification" value={educationDetails.qualification} onChange={handleEducationChange} required />
        </label>
        <br />
</div>
<div className="eight wide field">
        <label>
          Start Date:
          <input type="date" name="start_date" value={educationDetails.start_date} onChange={handleEducationChange} required />
        </label>
        </div>
        <br />
        <div  className="eight wide field">
        <label>
          End Date:
          <input type="date" name="end_date" value={educationDetails.end_date} onChange={handleEducationChange} required />
        </label>
        </div>
        <br />
        <div className="eight wide field">
        <input type="file" onChange={handleDocumentChange} required />
        <br />
        </div>
        <br/>
        <div className="eight wide field">
        <select value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
          <option value="official">Official</option>
          <option value="institution">Institution</option>
          <option value="other">Other</option>
        </select>
        </div>
      
        <br />
        <button className='ui teal button'style={{ width: "200px", marginLeft:"110px",marginTop:"20px"}} type="submit">Submit</button>
      </form>
      <div>

    </div>
      </div>
      </div>
      
    </div>
  );
};

export default EducationDocumentUpload;
