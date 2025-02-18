import React, { useState, useEffect } from 'react';
import { retrieve } from "../Encryption";
import { useParams, useNavigate } from 'react-router-dom';

const UpdateLeave = () => {
  const { id } = useParams();
  const [leave, setLeave] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://hrs-iymg.onrender.com/leaves/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + retrieve().access_token,
      },
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('Failed to fetch leave');
        }
        return resp.json();
      })
      .then((data) => {
        setLeave(data);
        setStartDate(data.start_date.split('T')[0]);
        setEndDate(data.end_date.split('T')[0]);
        setDescription(data.description);
      })
      .catch((error) => {
        console.error('Error fetching leave:', error);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedLeave = {
      start_date: startDate,
      end_date: endDate,
      description: description,
    };

    fetch(`https://hrs-iymg.onrender.com/leaves/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + retrieve().access_token,
      },
      body: JSON.stringify(updatedLeave),
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('Failed to update leave');
        }
        return resp.json();
      })
      .then((updatedData) => {
        console.log('Updated Leave:', updatedData);
        navigate(`/employee/view_leaves/${retrieve().employee.id}`);
      })
      .catch((error) => {
        console.error('Error updating leave:', error);
      });
  };

  return (
    <div className='content-wrapper' style={{ marginLeft: "280px", backgroundColor:"white", marginTop:"20px"}}>
      <h2 style={{ marginLeft:"570px",marginTop:"60px"}}>Update Leave</h2>
      <div className="ui equal width form" style={{ marginLeft:"450px",marginTop:"60px"}}>
      <form onSubmit={handleSubmit}>
      <div className="eight wide field">
        <label>
          Start Date:
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </label>
        </div>
        <br />
        <div className="eight wide field">
        <label>
          End Date:
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </label>
        </div>
        <br />
        <div className="eight wide field">
        <label>
          Description:
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        </div>
        <br />
        <button type="submit" className='ui teal button'style={{ width: "200px", marginLeft:"110px",marginTop:"20px"}}>Update Leave</button>
      </form>
      </div>
    </div>
  );
};

export default UpdateLeave;
