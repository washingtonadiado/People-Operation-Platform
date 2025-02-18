import React, { useState, useEffect } from 'react';
import { retrieve } from "../Encryption";
import { useParams, useNavigate } from 'react-router-dom';
import AddDocument from './AddDocument';
import 'semantic-ui-css/semantic.min.css'
const ViewDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [showAddDocument,setShowAddDocument] = useState(false);
  const navigate = useNavigate();
  const employeeId = retrieve().employee.id;

  useEffect(() => {
    const fetchDocuments = () => {
      fetch(`https://hrs-iymg.onrender.com/documents/employee/${employeeId}`, {
        headers: {
          "Authorization": "Bearer " + retrieve().access_token
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch Documents');
          }
          return response.json();
        })
        .then(data => {
          setDocuments(data);
        })
        .catch(error => {
          console.error('Error fetching documents:', error);
        });
    };

    fetchDocuments();
  }, [employeeId]);

  const handleUpdateDocument = (document) => {
    navigate(`/employee/update_document/${document.id}`);
  };

  const handleDeleteDocument = (documentId) => {
    fetch(`https://hrs-iymg.onrender.com/documents/${documentId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + retrieve().access_token,
      },
    })
      .then((res) => {
        console.log("RES: ", res);
       
        setDocuments(documents.filter(doc => doc.id !== documentId));
      })
      .catch((err) => {
        console.log(err);
        throw new Error(err);
      });
  };
  const handleAddDocumentClose = () => {
    setShowAddDocument(false);
};

  return (
    <div className='content-wrapper' style={{ marginLeft: "100px", backgroundColor:"white", marginTop:"20px"}}>
    <div className='main_container'>
      <h2 className='header2' style={{ marginLeft:"10px"}}>My Documents</h2>
      <table className="ui striped table" style={{ width: "1200px",marginBottom:"20px"}}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Link</th> 
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map(document => (
            <tr key={document.id}>
              <td>{document.name}</td>
              <td>{document.type}</td>
              <td><a href={document.link_url} target="_blank" rel="noopener noreferrer">{document.link_url}</a></td>
              <td>
                <button className='ui mini teal button' style={{ marginLeft:"10px"}} onClick={() => handleUpdateDocument(document)}>Update</button>
                <button  className='ui mini teal button' style={{ marginLeft:"10px"}}onClick={() => handleDeleteDocument(document.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showAddDocument && <AddDocument onClose={handleAddDocumentClose}  documents={documents} setDocuments={setDocuments} />}
      <button className='ui teal button'style={{ width: "200px", marginLeft:"60px",marginTop:"60px"}} onClick={() => setShowAddDocument(true)}>Add Document</button>
    </div>
    </div>
  );
};

export default ViewDocuments;
