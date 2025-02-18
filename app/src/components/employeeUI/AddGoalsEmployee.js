import React, { useState, useEffect } from 'react'; 
import { Formik, Field, Form } from 'formik';
import axios from 'axios'; 
import { retrieve } from "../Encryption";
import './AddGoalsEmployee.css';

const AddGoalForm = () => {
  const [managers, setManagers] = useState([]);
  const [message, setMessage] = useState('');
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    axios.get('https://hrs-iymg.onrender.com/managers_with_names', {
      headers: {
        "Authorization": "Bearer " + retrieve().access_token
      }
    })
    .then(res => {
      setManagers(res.data);
    })
    .catch(err => {
      console.error(err);
    });

    axios.get('https://hrs-iymg.onrender.com/sessions', {
    })
    .then(res => {
      setSessions(res.data);
    })
    .catch(err => {
      console.error(err);
    });
}, []);


const handleSubmit = async (values) => {
  try {
    const response = await axios.post('https://hrs-iymg.onrender.com/goals', values, {
      headers: {
        "Authorization": "Bearer " + retrieve().access_token
      }
    });
    console.log('New Goal:', response.data);
    setMessage('Goal added successfully!'); 
  } catch (error) {
    console.error('Error adding goal:', error);
    setMessage('Error adding goal.'); 
  }
};

  return (
    <div className='add-goal-form' style={{ marginLeft: "280px", marginTop:"20px"}}>
      <Formik
  initialValues={{
    name: '',
    description: '',
    manager_id: '',
    session_id: '',
  }}
  onSubmit={handleSubmit}
>
  <Form>
    <label>
      Goal Name:
      <Field type="text" name="name" required />
    </label>
    <br />
    <label>
      Description:
      <Field type="text" name="description" required />
    </label>
    <br />
    <label>
      Manager:
      <Field as="select" name="manager_id" required>
        <option value="">Select a manager</option>
        {managers.map(manager => (
          <option key={manager.id} value={manager.id}>{manager.name}</option>
        ))}
      </Field>
    </label>
    <br />
    <label>
      Session:
    <Field as="select" name="session_id" required>
        <option value="">Select a session</option>
        {sessions.map(session => (
          <option key={session.id} value={session.id}>{session.name}</option>
        ))}
      </Field>
    </label>
    <br />
    <button type="submit">Add Goal</button>
  </Form>
</Formik>
      {message && <p>{message}</p>} 
    </div>
  );
};

export default AddGoalForm;