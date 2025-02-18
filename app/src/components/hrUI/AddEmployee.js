import React, { useState, useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';
import './AddEmployee.css';

const AddEmployeeForm = () => {
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('https://hrs-iymg.onrender.com/departments');
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('https://hrs-iymg.onrender.com/employees', values);
      console.log('New Employee:', response.data);
      setMessage('Employee added successfully!');
    } catch (error) {
      console.error('Error adding employee:', error);
      setMessage('Error adding employee.');
    }
  };

  return (
    <div className='add-employee-form' style={{ marginLeft: "280px", marginTop:"20px"}}>
      <Formik
        initialValues={{
          email: '',
          password: '',
          personal_no:"",
          role:"",
          dept_id: ''
        }}
        onSubmit={handleSubmit}
      >
        <Form>
          <label>
            Email:
            <Field type="email" name="email" required />
          </label>
          <br />
          <label>
            Password:
            <Field type="password" name="password" required />
          </label>
          <br />
          <label>
            Staff No:
            <Field type="text" name="personal_no" required />
          </label>
          <br />
          <label htmlFor="role">Role</label>
          <Field as="select" name="role" id="role" required>
            <option value="">Select a role</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
            <option value="hr">HR</option>
          </Field>
          <br />
          <label>
            Department:
            <Field as="select" name="dept_id" required>
              <option value="">Select a department</option>
              {departments.map(department => (
                <option key={department.id} value={department.id}>{department.name}</option>
              ))}
            </Field>
          </label>
          <br />
          <button type="submit">Add Employee</button>
        </Form>
      </Formik>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddEmployeeForm;
