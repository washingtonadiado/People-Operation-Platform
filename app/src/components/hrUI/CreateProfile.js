import React, { useState, useEffect } from "react";
import "./create_profile.css";
import { useNavigate } from "react-router-dom";
import { retrieve } from "../Encryption";
import { useFormik } from "formik";
import * as yup from "yup";

const CreateProfile = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const MAX_FILE_SIZE = 10000000; //10MB
  const validFileExtensions = {
    image: ["jpg", "png", "jpeg", "webp"],
  };
  const getExtension = (fileName) => {
    if (!fileName) return null;
    const parts = fileName.split(".");
    return parts[parts.length - 1].toLowerCase();
  };
  const handleChange = (event) => {
    const file = event.target.files[0]; // get the file object
    if (file) {
      const size = file.size; // get the file size in bytes
      //check file extension
      const isValid = validFileExtensions.image.includes(
        getExtension(file.name)
      );
      if (size > MAX_FILE_SIZE) setError("The file is too large");
      else if (!isValid) setError("The file type is not supported");
      else {
        setError(null);
        setProfilePhoto(file);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      mantra: "",
      phone_contact: "",
      title: "",
      date_of_birth: "",
    },
    validationSchema: yup.object().shape({
      first_name: yup.string().required("Please fill out this field"),
      last_name: yup.string().required("Please fill out this field"),
      mantra: yup.string().required("Please fill out this field"),
      phone_contact: yup
        .string()
        .required("Please fill out this field")
        .min(10, "Phone contact must be atleast 10 characters"),
      title: yup.string().required("Please fill out this field"),
      date_of_birth: yup.date().required("Please fill out this field"),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("first_name", values.first_name);
      formData.append("last_name", values.last_name);
      formData.append("mantra", values.mantra);
      formData.append("phone_contact", values.phone_contact);
      formData.append("title", values.title);
      formData.append("date_of_birth", values.date_of_birth);
      formData.append("profile_photo", profilePhoto);
      console.log(...formData.entries());

      fetch("https://hrs-iymg.onrender.com/hrProfiles", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + retrieve().access_token,
        },
        body: formData,
      }).then((response) => {
        if (response.ok) {
          // clear out form fields
          formik.resetForm();
          //set success message
          setSuccess("Profile creation successful!!");
          //navigate user to home page
          navigate("/hr/hr_profile");
          setProfilePhoto(null);
        } else {
          return response.json().then((err) => console.log(err));
        }
      });
    },
  });

  return (
    <div className="content-wrapper-hr">
      <div className="container-hr">
        <div className="form-container-hr">
          <form className="profile-form-hr" onSubmit={formik.handleSubmit}>
            {success ? <h4 className="secondary-title-hr">{success}</h4> : null}
            <div className="form-control-hr">
              <label htmlFor="profile_photo">Upload photo</label>
              <br />
              <input
                type="file"
                id="profile_photo"
                name="profile_photo"
                onChange={handleChange}
                required
              />
              {error && <div className="error">{error}</div>}
            </div>
            <div className="form-control-hr">
              <label htmlFor="first_name">First Name</label>
              <br />
              <input
                type="text"
                id="first_name"
                name="first_name"
                placeholder="eg. John"
                value={formik.values.first_name}
                onChange={formik.handleChange}
              />
              {formik.touched.first_name && formik.errors.first_name ? (
                <div className="error">{formik.errors.first_name}</div>
              ) : null}
            </div>

            <div className="form-control-hr">
              <label htmlFor="last_name">Last Name</label>
              <br />
              <input
                type="text"
                id="last_name"
                name="last_name"
                placeholder="eg. Doe"
                value={formik.values.last_name}
                onChange={formik.handleChange}
              />
              {formik.touched.last_name && formik.errors.last_name ? (
                <div className="error">{formik.errors.last_name}</div>
              ) : null}
            </div>

            <div className="form-control-hr">
              <label htmlFor="mantra">Mantra</label>
              <br />
              <input
                type="text"
                id="mantra"
                name="mantra"
                placeholder="mantra goes here..."
                value={formik.values.mantra}
                onChange={formik.handleChange}
              />
              {formik.touched.mantra && formik.errors.mantra ? (
                <div className="error">{formik.errors.mantra}</div>
              ) : null}
            </div>

            <div className="form-control-hr">
              <label htmlFor="phone_contact">Contact</label>
              <br />
              <input
                type="tel"
                id="phone_contact"
                name="phone_contact"
                placeholder="eg. +2547920911"
                value={formik.values.phone_contact}
                onChange={formik.handleChange}
              />
              {formik.touched.phone_contact && formik.errors.phone_contact ? (
                <div className="error">{formik.errors.phone_contact}</div>
              ) : null}
            </div>

            <div className="form-control-hr">
              <label htmlFor="title">Title</label>
              <br />
              <input
                type="text"
                id="form-title"
                name="title"
                placeholder="eg. Mr. Mrs"
                value={formik.values.title}
                onChange={formik.handleChange}
              />
              {formik.touched.title && formik.errors.title ? (
                <div className="error">{formik.errors.title}</div>
              ) : null}
            </div>
            <div className="form-control-hr">
              <label htmlFor="date_of_birth">Date of Birth</label>
              <br />
              <input
                type="date"
                id="date_of_birth"
                name="date_of_birth"
                value={formik.values.date_of_birth}
                onChange={formik.handleChange}
              />
              {formik.touched.date_of_birth && formik.errors.date_of_birth ? (
                <div className="error">{formik.errors.date_of_birth}</div>
              ) : null}
            </div>
            <div className="create-account-container-hr">
              {/* <input type="submit" /> */}
              <button className="creeate-btn" type="submit">
                Create Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
