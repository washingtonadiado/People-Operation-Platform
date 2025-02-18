import React, { useState } from "react";
import "./viewPayslip.css";
import PaySlipEmployee from "./PaySlipEmployee";
import RequestPayslip from "./RequestPayslip";

const ViewPayslipEmployee = () => {
  //set payslip state
  const [payslip, setPayslip] = useState(null);
  return (
    <div className="payslip-container">
      <RequestPayslip setPayslip={setPayslip} />
      {payslip ? (
        <PaySlipEmployee payslip={payslip} />
      ) : (
        <h1 className="payslip-message text-secondary">
          payslip will appear here
        </h1>
      )}
    </div>
  );
};

export default ViewPayslipEmployee;
