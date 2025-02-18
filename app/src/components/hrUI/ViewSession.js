import React, { useState, useEffect } from 'react'
import {retrieve} from "../Encryption";
import { useNavigate } from 'react-router-dom';
import './viewSession.css'

import CreateSession from './CreateSession'

const ViewSession = ({sessions, setSessions}) => {
    const [showCreateSession, setShowCreateSession] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const navigate=useNavigate()
    // const { id } = useParams()

    useEffect(() => {
        const fetchSessions = () => {
            fetch('https://hrs-iymg.onrender.com/sessions', {
                headers: {
                    "Authorization": "Bearer " + retrieve().access_token,
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch sessionss');
                    }
                    return response.json();
                })
                .then(data => setSessions(data))
                .catch(error => console.error('Error fetching sessions:', error));
        };

        fetchSessions();
    }, [setSessions]);

    const handleCreateSessionClose = () => {
        setShowCreateSession(false);
    };

    const handleUpdateSession =(session)=>{
        navigate(`/hr/update_session/${session.id}`);
    }

    const handleDeleteSession =(sessionId)=>{
        fetch(`https://hrs-iymg.onrender.com/sessions/${sessionId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + retrieve().access_token,
      },
    })
      .then((res) => {
        console.log("RES: ", res);
       
      })
      .then((data)=>{
        const updatedSessions = sessions.filter(session => session.id !== sessionId);
        setSessions(updatedSessions)
        
      })
      .catch((err) => {
        console.log(err);
        throw new Error(err);
      });
        
    }

    const filteredSessions = sessions.filter(session => {
        const startDate = new Date(session.start_date);
        const endDate = new Date(session.end_date);
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        if (from && startDate < from) return false;
        if (to && endDate > to) return false;

        return true;
    });

  return (
    <div className='content-wrapper' style={{ marginLeft: "280px", backgroundColor:"white", marginTop:"20px"}}>
            <h2>Sessions</h2>
            <div>
                <label htmlFor="fromDate">From: </label>
                <input type="date" id="fromDate" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                <label htmlFor="toDate">To: </label>
                <input type="date" id="toDate" value={toDate} onChange={e => setToDate(e.target.value)} />
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredSessions.map(session => (
                        <tr key={session.id}>
                            <td>{session.name}</td>
                            <td>{session.start_date}</td>
                            <td>{session.end_date}</td>
                            <td>
                                <button onClick={() => handleUpdateSession(session)}>Update</button>
                                <button onClick={() => handleDeleteSession(session.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showCreateSession && <CreateSession onClose={handleCreateSessionClose} sessions={sessions} setSessions={setSessions} />}
            {/* {id && <Updatesessions session={sessions.find(session => session.id === id)} sessions={sessions} setsessions={setsessions} />} */}

            <button onClick={() => setShowCreateSession(true)}>Add session</button>
        </div>
  )
}

export default ViewSession