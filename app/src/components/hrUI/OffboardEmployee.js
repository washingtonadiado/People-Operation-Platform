import React, { useState } from 'react';
import axios from 'axios';

const OffboardEmployee = () => {
  const [employeeId, setEmployeeId] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.delete(`https://hrs-iymg.onrender.com/employees/${employeeId}`);
      console.log(response.data);
      setEmployeeId('');  
    } catch (error) {
      console.error('Error offboarding employee:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Employee ID:
        <input type="text" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} required />
      </label>
      <br />
      <button type="submit">Offboard Employee</button>
    </form>
  );
};

export default OffboardEmployee;
