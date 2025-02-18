import React, { useState, useEffect } from "react";
import { retrieve } from "../Encryption";
import { useParams } from "react-router-dom";

const VerifyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const { employeeId } = useParams();

  useEffect(() => {
    fetch(`https://hrs-iymg.onrender.com/documents/employee/${employeeId}`, {
      headers: {
        Authorization: "Bearer " + retrieve().access_token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }
        return response.json();
      })
      .then((data) => {
        setDocuments(data);
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
      });
  }, [employeeId]);

  return (
    <div
      className="content-wrapper"
      style={{ marginLeft: "280px", backgroundColor: "white", marginTop: "20px" }}

    >
       <h1 style={{ marginLeft:"500px", marginBottom:"50px"}}>Verify Documents</h1>
      {documents.length > 0 ? (
        <table className='ui striped table' style={{ width: "1200px", marginLeft:"60px",marginBottom:"20px"}}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.id}>
                <td>{document.name}</td>
                <td>{document.type}</td>
                <td>
                  <a href={document.link_url} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No documents to be verified found.</p>
      )}
    </div>
  );
};

export default VerifyDocuments;
