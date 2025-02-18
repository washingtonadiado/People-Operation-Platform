import React, { useState, useEffect } from 'react';
import { retrieve } from "../Encryption";
import { useParams, useNavigate } from 'react-router-dom';

const UpdateDocument = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [newDocument, setNewDocument] = useState(null);
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://hrs-iymg.onrender.com/documents/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + retrieve().access_token,
      },
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('Failed to fetch document');
        }
        return resp.json();
      })
      .then((data) => {
        setDocument(data);
        setDocumentName(data.name);
        setDocumentType(data.type);
      })
      .catch((error) => {
        console.error('Error fetching document:', error);
      });
  }, [id]);

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

    fetch(`https://hrs-iymg.onrender.com/update_document/upload/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer ' + retrieve().access_token,
      },
      body: formData,
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('Failed to update document');
        }
        return resp.json();
      })
      .then((updatedData) => {
        console.log('Updated Document:', updatedData);
        navigate(`/employee/view_documents/${retrieve().employee.id}`);
      })
      .catch((error) => {
        console.error('Error updating document:', error);
      });
  };

  return (
    <div className='content-wrapper' style={{ marginLeft: "280px", backgroundColor:"white", marginTop:"20px"}}>
      <h2 style={{ marginLeft:"570px",marginTop:"60px"}}>Update Document</h2>
      <div className="ui equal width form" style={{ marginLeft:"450px",marginTop:"60px"}}>
      <form onSubmit={handleSubmit}>
      <div className="eight wide field">
        <label>
          Document Name:
          <input type="text" value={documentName} onChange={(e) => setDocumentName(e.target.value)} required />
        </label>
        </div>
        <br />
        <div className="eight wide field">
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
        <div className="eight wide field">
        <input type="file" onChange={handleDocumentChange} required />
        <br />
        </div>
        <button type="submit" className='ui teal button'style={{ width: "200px", marginLeft:"110px",marginTop:"20px"}}>Update Document</button>
      </form>
      </div>
    </div>
  );
};

export default UpdateDocument;
