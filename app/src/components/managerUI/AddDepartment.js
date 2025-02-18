import React, { useState } from 'react';
import { retrieve } from '../Encryption';
import { useNavigate } from 'react-router-dom';

const AddDepartment = ({ departments, setDepartments }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(true); 

  const handleSubmit = (e) => {
    e.preventDefault();

    const newDepartment = {
      name: name,

    };

    fetch(`https://hrs-iymg.onrender.com/departments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + retrieve().access_token,
      },
      body: JSON.stringify(newDepartment),
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('Failed to add department');
        }
        return resp.json();
      })
      .then((data) => {
        console.log('Added Department:', data);
        setDepartments([...departments, data]);
        setShowForm(false);
      })
      .catch((error) => {
        console.error('Error adding department:', error);
      });
  };

  if (!showForm) {
  
    return null;
  }

  return (
    <div className='content-wrapper' style={{ marginLeft: "60px", backgroundColor: "white", marginTop: "20px" }}>
      <h2 style={{  marginTop: "120px" }}>Add Department</h2>
      <div className="ui equal width form" style={{ marginLeft: "", marginTop: "60px" }}>
        <form onSubmit={handleSubmit}>
          <div className="six wide field">
            <label>
              Department Name:
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
          </div>
          <br />
        
          <button type="submit" className='ui teal button' style={{ width: "200px", marginLeft: "110px", marginTop: "20px" }}>Add Department</button>
        </form>
      </div>
    </div>
  );
};

export default AddDepartment;
