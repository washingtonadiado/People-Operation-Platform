import React from "react";
import { useFormik } from "formik";
import { retrieve } from "../Encryption";
import * as yup from "yup";
import "./requestPayslip.css";

const RequestPayslip = ({ setPayslip }) => {
  const formik = useFormik({
    initialValues: {
      year: "",
      month: "",
    },
    validationSchema: yup.object().shape({
      year: yup
        .number()
        .min(2000)
        .max(2024)
        .required("Please fill out this field"),
      month: yup.number().max(12).min(1).required("Please fill out this field"),
    }),
    onSubmit: (values) => {
      // fetch payslip request
      fetch(`https://hrs-iymg.onrender.com/payslip?year=${values.year}&month=${values.month}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + retrieve().access_token,
          Accept: "application/json",
        },
      })
        .then((resp) => {
          if (!resp.ok) {
            resp.json().then((error) => console.log(error));
          } else {
            resp.json().then((payslipData) => {
              //set payslip state with fetched payslip
              setPayslip(payslipData.payslip);
              //log data or errors
              console.log(payslipData);
            });
          }
        })
        .catch((error) => console.log(error));
    },
  });

  return (
    <form className="search-container" onSubmit={formik.handleSubmit}>
      <div class="row mb-4">
        <div class="col">
          <div data-mdb-input-init class="form-outline">
            {formik.touched.year && formik.errors.year ? (
              <div className="error">{formik.errors.year}</div>
            ) : null}
            <input
              type="number"
              id="year"
              name="year"
              class="form-control"
              value={formik.values.year}
              onChange={formik.handleChange}
            />
            <label class="form-label" for="year">
              Enter Year
            </label>
          </div>
        </div>
        <div class="col">
          <div data-mdb-input-init class="form-outline">
            {formik.touched.month && formik.errors.month ? (
              <div className="error">{formik.errors.month}</div>
            ) : null}
            <input
              type="number"
              id="month"
              name="month"
              class="form-control"
              value={formik.values.month}
              onChange={formik.handleChange}
            />
            <label class="form-label" for="month">
              Enter Month
            </label>
          </div>
        </div>
      </div>
      <button
        data-mdb-ripple-init
        type="submit"
        class="btn btn-success btn-block mb-4"
      >
        Request payslip
      </button>
    </form>
  );
};

export default RequestPayslip;
