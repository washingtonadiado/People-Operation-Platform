import React, { useEffect, useState } from "react";
import axios from "axios";

const ManagerApprovedLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get(
          "https://hrs-iymg.onrender.com/leave_approvals"
        );
        const approvedLeaves = response.data.leave_approvals
          .filter((leave) => leave.approved_by_manager)
          .sort(
            (a, b) =>
              new Date(b.manager_app_date) - new Date(a.manager_app_date)
          ); // Sort by date in descending order
        setLeaves(approvedLeaves);
      } catch (error) {
        if (error.response) {
          setError(error.response.data.message);
        } else {
          setError("An error occurred while fetching leaves");
        }
      }
    };

    fetchLeaves();
  }, []);

  return (
    <div>
      {error && <p>{error}</p>}
      {leaves.map((leave) => (
        <div key={leave.leave_id}>
          <p>Employee ID: {leave.employee_id}</p>
          <p>
            Manager Approval Date:{" "}
            {new Date(leave.manager_app_date).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p>Status: Approved by Manager</p>
        </div>
      ))}
    </div>
  );
};

export default ManagerApprovedLeaves;
