import React, { useState, useEffect } from 'react';



const ViewManagers = () => {
    const [managers, setManagers] = useState([]);

    useEffect(() => {
        fetch('https://hrs-iymg.onrender.com/manager_department_details')
            .then(response => response.json())
            .then(data => {
                setManagers(data);
            })
            .catch(error => {
                console.error('Error fetching manager details:', error);
            });
    }, []);

    return (
        <div className='content-wrapper' style={{ marginLeft: "280px", backgroundColor:"white", marginTop:"20px"}}>
            <h2 style={{ marginLeft:"500px", marginBottom:"50px"}}>Manager Details</h2>
            <table>
                <thead>
                    <tr>
                    <th>Personal No</th>
                      
                     
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Mantra</th>
                        <th>Phone Contact</th>
                        <th>Email</th>
                        <th>Department</th>
                    </tr>
                </thead>
                <tbody>
                    {managers.map(manager => (
                        <tr key={manager.id}>
                             <td>{manager.personal_no}</td>
                     
                           
                            <td>{manager.first_name}</td>
                            <td>{manager.last_name}</td>
                            <td>{manager.mantra}</td>
                            <td>{manager.phone_contact}</td>
                            <td>{manager.email}</td>
                            <td>{manager.department_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewManagers;
