import React, { useState } from 'react';
import { retrieve } from "../Encryption";
import { useNavigate } from 'react-router-dom';

const AddDocument = ({ documents, setDocuments, onClose }) => {
  const [newDocument, setNewDocument] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [showAddButton, setShowAddButton] = useState(true);
  const navigate = useNavigate();
  const employeeId = retrieve().employee.id;

  const handleDocumentChange = (e) => {
    setNewDocument(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newDocument) {
      console.error('No document selected');
      return;
    }

    const formData = new FormData();
    formData.append('document', newDocument);
    formData.append('name', documentName);
    formData.append('type', documentType);

    fetch(`https://hrs-iymg.onrender.com/upload/${employeeId}`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + retrieve().access_token,
      },
      body: formData,
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('Failed to add document');
        }
        return resp.json();
      })
      .then((data) => {
        setDocumentName('');
        setDocumentType('');
        setDocuments([...documents, data]);
        onClose(); 
      })
      .catch((error) => {
        console.error('Error adding document:', error);
      });
  };

  const handleExit = () => {
    onClose();
  };

  return (
    <div className='content-wrapper' style={{ marginLeft: "10px", backgroundColor: "white", marginTop: "40px" }}>
      <h2 style={{ marginLeft:"390px",marginTop:"60px"}}>Add Document</h2>
      <div className="ui equal width form" style={{ marginLeft:"210px",marginTop:"60px",width:"800px"}} >
        <div >
     
          <form onSubmit={handleSubmit} >
            
            <div className="twelve wide field">
              <label >
                Document Name:
                <input type="text" value={documentName} onChange={(e) => setDocumentName(e.target.value)} required />
              </label>
              </div>
              <br />
              <div className="twelve wide field">
              <label>
                Document Type:
                <select value={documentType} onChange={(e) => setDocumentType(e.target.value)} required>
                  <option value="">Select Type</option>
                  <option value="official">Official</option>
                  <option value="institution">Institution</option>
                  <option value="other">Other</option>
                </select>
              </label>
              </div>
              <br />
              <div className="twelve wide field">
              <input type="file" onChange={handleDocumentChange} required />
              <br />
              <button type="submit" className="ui teal button" style={{ marginBottom: '20px', marginTop: '40px',marginLeft:"250px" }}>Submit</button>
            </div>
          
          </form>
          <div>
            <button onClick={handleExit} className="mini ui teal button" style={{ marginLeft:"550px"}} >Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDocument;
