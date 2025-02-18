import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { retrieve } from "../Encryption";
import './DeleteEmployee.css';

const DeleteEmployeeForm = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('https://hrs-iymg.onrender.com/employees', {
                    headers: {
                        'Authorization': `Bearer ${retrieve().access_token}`
                    }
                });
                setEmployees(response.data);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.delete(`https://hrs-iymg.onrender.com/employees/${selectedEmployee.id}`, {
                headers: {
                    'Authorization': `Bearer ${retrieve().access_token}`
                }
            });
            setMessage('Employee successfully deleted');
        } catch (error) {
            console.error('Error deleting employee:', error);
            setMessage('Error deleting employee.');
        }
    };

    return (
        <div className='delete-employee-form' style={{ marginLeft: "280px", marginTop:"20px"}}>
            <form onSubmit={handleSubmit}>
                <label>
                    Employee Name:
                    <select onChange={e => setSelectedEmployee(employees.find(emp => emp.id === e.target.value))} required>
                        <option value="">Select an employee</option>
                        {employees.map(employee => (
                            employee.employee_profiles.map(profile => (
                                <option key={employee.id} value={employee.id}>{profile.first_name} {profile.last_name}</option>
                            ))
                        ))}
                    </select>
                </label>
                <button type="submit">Offboard Employee</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default DeleteEmployeeForm;



