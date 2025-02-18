import React, { useState, useEffect } from 'react';
import { retrieve } from '../Encryption';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateDepartment = () => {
  const [department, setDepartment] = useState(null);
  const [name, setName] = useState('');
  const {id}=useParams()
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://hrs-iymg.onrender.com/departments/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + retrieve().access_token,
      },
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('Failed to fetch department');
        }
        return resp.json();
      })
      .then((data) => {
        setDepartment(data);
        setName(data.name);
      })
      .catch((error) => {
        console.error('Error fetching department:', error);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedDepartment = {
      name: name,
    };

    fetch(`https://hrs-iymg.onrender.com/departments/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + retrieve().access_token,
      },
      body: JSON.stringify(updatedDepartment),
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('Failed to update department');
        }
        return resp.json();
      })
      .then((updatedData) => {
        console.log('Updated Department:', updatedData);
        navigate("/manager/departments")
      })
      .catch((error) => {
        console.error('Error updating department:', error);
      });
  };

  return (
    <div className='content-wrapper' style={{ marginLeft: "280px", backgroundColor: "white", marginTop: "20px" }}>
      <h2 style={{ marginLeft: "570px", marginTop: "60px" }}>Update Department</h2>
      <div className="ui equal width form" style={{ marginLeft: "450px", marginTop: "60px" }}>
        <form onSubmit={handleSubmit}>
          <div className="eight wide field">
            <label>
              Department Name:
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
          </div>
          <br />
          <button type="submit" className='ui teal button' style={{ width: "200px", marginLeft: "110px", marginTop: "20px" }}>Update Department</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateDepartment;
