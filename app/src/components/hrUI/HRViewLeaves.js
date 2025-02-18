import React, { useState, useEffect } from "react";
import { retrieve } from "../Encryption";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HRViewLeaves = () => {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [managers, setManagers] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get("https://hrs-iymg.onrender.com/leaves", {
          headers: {
            Authorization: `Bearer ${retrieve().access_token}`,
          },
        });
        setLeaves(response.data);
      } catch (error) {
        if (error.response) {
          setError(error.response.data.message);
        } else {
          setError("An error occurred while fetching leaves");
        }
      }
    };

    fetchLeaves();

    axios
      .get("https://hrs-iymg.onrender.com/managers_with_names", {
        headers: {
          Authorization: "Bearer " + retrieve().access_token,
        },
      })
      .then((res) => {
        setManagers(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleCreateLeaveApproval = (leave_id, employee_id) => {
    const values = {
      leave_id: leave_id,
      employee_id: employee_id,
      hr_id: retrieve().hr.id,
    };

    fetch("https://hrs-iymg.onrender.com/leave_approvals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + retrieve().access_token,
      },
      body: JSON.stringify(values),
    })
      .then((resp) => {
        if (resp.ok) {
          resp
            .json()
            .then((data) => setSuccess("Laeve approval created successfully!"));
        } else {
          resp.json().then((error) => setError(error.error));
        }
      })
      .catch((err) => console.log("err", err));
  };

  return (
    <div className="container w-50 bg-white text-dark m-auto pt-4">
      {success && <p className="success">{success}</p>}
      {leaves.map((leave) => (
        <div key={leave.id} className="leave">
          <p className="fs-6">
            <span className="text-muted">Employee ID:</span>
            {leave.employee_id}
          </p>
          <p className="fs-6">
            <span className="text-muted">Start Date:</span>
            {new Date(leave.start_date).toDateString()}
          </p>
          <p className="fs-6">
            <span className="text-muted">End Date:</span>
            <span>{new Date(leave.end_date).toDateString()}</span>
          </p>
          <p className="fs-6">
            <span className="text-muted">Description:</span>
            {leave.description}
          </p>
          <button
            className="button approve"
            onClick={() =>
              handleCreateLeaveApproval(leave.id, leave.employee_id)
            }
          >
            Create Approval
          </button>
        </div>
      ))}
    </div>
  );
};

export default HRViewLeaves;
