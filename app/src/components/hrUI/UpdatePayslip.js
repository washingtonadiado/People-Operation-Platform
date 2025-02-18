import React, { useEffect, useState } from "react";
import { retrieve } from "../Encryption";
import { json } from "react-router-dom";

const UpdatePayslip = ({
  setPayslip,
  remuneration,
  setRemuneration,
  setShowUpdatePayslip,
}) => {
  const [employees, setEmployees] = useState([]);

  //fetch employee profiles
  useEffect(() => {
    fetch("https://hrs-iymg.onrender.com/employeeProfiles")
      .then((resp) => resp.json())
      .then((data) => setEmployees(data));
  }, []);
  //get employee names
  const employeeNames = employees?.map((employee) => (
    <option key={employee.id} value={employee.employee_id}>
      {employee.first_name + " " + employee.last_name}
    </option>
  ));

  //form functions
  const handleRemunerationChange = (e) => {
    const { name, value } = e.target;
    setRemuneration({
      ...remuneration,
      [name]: value,
    });
  };

  const handleRemunerationDescriptionChange = (e) => {
    const { id, name, value } = e.target;
    const remunerations = remuneration.remunerations;
    remunerations[id][name] = value;
    setRemuneration({
      ...remuneration,
      remunerations: remunerations,
    });
  };

  //delete remuneration data

  const handleDelete = (index) => {
    const remunerations = remuneration.remunerations;
    remunerations.splice(index, 1);
    setRemuneration({
      ...remuneration,
      remunerations: remunerations,
    });
  };

  // handle adding a compensation
  const handleAddCompensation = () => {
    const updatedRemunerations = remuneration.remunerations;
    const newCompensation = {
      name: "",
      description: "",
      type: "",
      amount: "",
    };
    updatedRemunerations.push(newCompensation);
    setRemuneration({
      ...remuneration,
      remunerations: updatedRemunerations,
    });
  };

  //submit data
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`https://hrs-iymg.onrender.com/payslip/${remuneration.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + retrieve().access_token,
      },
      body: JSON.stringify({
        remuneration: {
          name: remuneration.name,
          salary: remuneration.salary,
          employee_id: remuneration.employee_id,
        },
        remuneration_descriptions: [remuneration.remunerations],
      }),
    })
      .then((resp) => {
        if (resp.ok) {
          //update state variable
          resp.json().then((data) => {
            //update state variables
            setPayslip(data.payslip);
            setRemuneration(data.remuneration);
            setShowUpdatePayslip(false);
          });
        } else {
          return resp.json();
        }
      })
      .then((data) => console.log(data));
  };

  return (
    <div className="update-payslip-container">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="col-md-4 mb-3">
            <label for="name">Remuneration name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              placeholder="eg. Basic Salary"
              value={remuneration?.name}
              onChange={handleRemunerationChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label for="salary">Salary</label>
            <input
              type="number"
              className="form-control"
              id="salary"
              placeholder="eg. 5000"
              name="salary"
              min={1}
              value={remuneration?.salary}
              onChange={handleRemunerationChange}
            />
          </div>
          <div className="form-group col-md-4">
            <label for="employee">Employee</label>
            <select
              id="employee_id"
              className="form-control"
              name="employee_id"
              value={remuneration?.employee_id}
              onChange={handleRemunerationChange}
              placeholder="Choose employee"
            >
              {/* Default "Choose employee" option */}
              <option value="" selected>
                Choose employee
              </option>
              {employeeNames}
            </select>
          </div>
          {remuneration?.remunerations.map((remuneration, index) => (
            <div key={index} className="form-row">
              <div className="col-md-4 mb-3">
                <label for="name">Compensation name</label>
                <input
                  type="text"
                  className="form-control"
                  id={index}
                  name="name"
                  placeholder="eg. Basic Salary"
                  value={remuneration?.name}
                  onChange={handleRemunerationDescriptionChange}
                  required={!remuneration?.name}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label for="description">Description</label>
                <input
                  type="text"
                  className="form-control"
                  id={index}
                  name="description"
                  placeholder="eg. sales commission"
                  value={remuneration?.description}
                  onChange={handleRemunerationDescriptionChange}
                  required={!remuneration?.description}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label for="name">Type</label>
                <select
                  type="text"
                  className="form-control"
                  id={index}
                  name="type"
                  placeholder="eg. bonus, allowance"
                  value={remuneration?.type}
                  onChange={handleRemunerationDescriptionChange}
                  required={!remuneration?.type}
                >
                  {/* Default "Choose employee" option */}
                  <option value="" selected>
                    Choose type
                  </option>
                  <option value={"normal"}>normal</option>
                  <option value={"bonus"}>bonus</option>
                  <option value={"allowance"}>allowance</option>
                  <option value={"deduction"}>deduction</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label for="name">Amount</label>
                <input
                  type="number"
                  className="form-control"
                  id={index}
                  name="amount"
                  placeholder="eg. 2000"
                  value={remuneration?.amount}
                  onChange={handleRemunerationDescriptionChange}
                  required={!remuneration?.amount}
                  min={0}
                />
              </div>
              <div className="col-sm-4 mb-3">
                <button
                  className="btn btn-warning btn-sm float-right"
                  onClick={(e) => handleDelete(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          className="btn btn-primary btn-sm col-1"
          onClick={handleAddCompensation}
        >
          Add
        </button>
        <button className="btn btn-success btn-block mt-4 mb-4" type="submit">
          Update Payslip
        </button>
      </form>
    </div>
  );
};

export default UpdatePayslip;
