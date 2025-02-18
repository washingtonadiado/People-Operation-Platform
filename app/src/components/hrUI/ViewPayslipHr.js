import React, { useState } from "react";
import "./viewPayslip.css";
import PaySlipEmployee from "./PaySlipEmployee";
import RequestPayslip from "./RequestPayslip";
import CreatePayslip from "./CreatePayslip";
import UpdatePayslip from "./UpdatePayslip";

const ViewPayslipHr = () => {
  //set payslip state
  const [payslip, setPayslip] = useState(null);
  const [remuneration, setRemuneration] = useState(null);
  const [showUpdatePayslip, setShowUpdatePayslip] = useState(false);

  return (
    <div className="payslip-container">
      <h1 className="payslip-message text-secondary fs-10">
        Request payslips here
      </h1>
      <RequestPayslip
        setPayslip={setPayslip}
        setRemuneration={setRemuneration}
      />
      {payslip ? (
        <>
          <PaySlipEmployee
            payslip={payslip}
            setPayslip={setPayslip}
            setShowUpdatePayslip={setShowUpdatePayslip}
            showUpdatePayslip={showUpdatePayslip}
          />
          {showUpdatePayslip && (
            <UpdatePayslip
              setPayslip={setPayslip}
              remuneration={remuneration}
              setShowUpdatePayslip={setShowUpdatePayslip}
              setRemuneration={setRemuneration}
            />
          )}
        </>
      ) : (
        <>
          <h1 className="payslip-message text-secondary fs-10">
            Generate new payslips here
          </h1>
          <CreatePayslip />
        </>
      )}
    </div>
  );
};

export default ViewPayslipHr;
