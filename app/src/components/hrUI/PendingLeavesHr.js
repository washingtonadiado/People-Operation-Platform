import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PendingLeavesHr.css";
import { retrieve } from "../Encryption";

const PendingLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get("https://hrs-iymg.onrender.com/leave_approvals");
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
  }, [refresh]);

  const handleApprove = async (leaveId) => {
    const hr_approval_date = new Date();

    fetch(`https://hrs-iymg.onrender.com/leave_approvals/${leaveId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + retrieve().access_token,
      },
      body: JSON.stringify({
        approved_by_hr: true,
        hr_approval_date: hr_approval_date.toISOString().replace("Z", ""),
      }),
    })
      .then((resp) => {
        if (resp.ok) {
          resp.json().then((data) => {
            setSuccess("Successfully approved leave");
          });
          setRefresh(!refresh);
        } else {
          resp.json().then((err) => setError(error.error));
        }
      })
      .catch((error) => console.log(error));
  };

  const handleDecline = async (leaveId) => {
    const hr_approval_date = new Date();

    fetch(`https://hrs-iymg.onrender.com/leave_approvals/${leaveId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + retrieve().access_token,
      },
      body: JSON.stringify({
        approved_by_hr: false,
        hr_approval_date: hr_approval_date.toISOString().replace("Z", ""),
      }),
    })
      .then((resp) => {
        if (resp.ok) {
          resp.json().then((data) => {
            setSuccess("Successfully declined leave");
          });
          setRefresh(!refresh);
        } else {
          resp.json().then((err) => setError(error.error));
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="container w-50 bg-white text-dark m-auto pt-4">
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      {leaves?.map((leave) => (
        <div key={leave.id} className="leave">
          <p>Employee ID: {leave.employee_id}</p>
          <p>
            {leave.approved_by_hr ? "Approved by HR" : "Not approved by HR"}
          </p>
          <p>
            {leave.approved_by_manager
              ? "Approved by Manager"
              : "Not approved by manager"}
          </p>
          {!leave.approved_by_hr ? (
            <button
              className="button approve"
              onClick={() => handleApprove(leave.id)}
            >
              Approve
            </button>
          ) : (
            <button
              className="button decline"
              onClick={() => handleDecline(leave.id)}
            >
              Decline
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default PendingLeaves;
