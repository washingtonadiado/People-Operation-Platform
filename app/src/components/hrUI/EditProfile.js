import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { retrieve } from "../Encryption";
import "./create_profile.css";

const EditProfile = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const id = retrieve().hr.id;
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [hrProfileData, setHrProfileData] = useState({});

  useEffect(() => {
    fetch(`https://hrs-iymg.onrender.com/hr_personnels/${id}`)
      .then((response) => response.json())
      .then((data) => setHrProfileData(data.hr_profiles[0]))
      .catch((err) => console.log(err));
  }, []);

  // image upload check size and extension type
  const MAX_FILE_SIZE = 10000000; //10MB
  const validFileExtensions = {
    image: ["jpg", "png", "jpeg", "webp"],
  };
  const getExtension = (fileName) => {
    console.log(fileName);
    if (!fileName) return null;
    const parts = fileName.split(".");
    return parts[parts.length - 1].toLowerCase();
  };
  // handle profile photo
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
      first_name: hrProfileData?.first_name,
      last_name: hrProfileData?.last_name,
      mantra: hrProfileData?.mantra,
      phone_contact: hrProfileData?.phone_contact,
      title: hrProfileData?.title,
      date_of_birth: hrProfileData?.date_of_birth,
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

      fetch(`https://hrs-iymg.onrender.com/hrProfiles/${hrProfileData.id}`, {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + retrieve().access_token,
        },
        body: formData,
      }).then((response) => {
        if (response.ok) {
          //set success message
          setSuccess("Successfully Updated account!!");
          //navigate user to home page
          navigate(`/hr/hr_profile`);
        } else {
          return response.json().then((err) => console.log(err));
        }
      });
    },
    enableReinitialize: true,
  });
  if (!hrProfileData) return <div>Loading...</div>;
  return (
    <div className="form-container">
      <form className="profile-form" onSubmit={formik.handleSubmit}>
        {success ? <h4 className="secondary-title">{success}</h4> : null}
        <div className="form-div">
          <label htmlFor="profile_photo" className="form-label">
            Upload photo
          </label>
          <br />
          <input
            type="file"
            id="profile_photo"
            name="profile_photo"
            onChange={handleChange}
          />
          {error && <div className="error">{error}</div>}
        </div>
        <div className="form-div">
          <label htmlFor="first_name" className="form-label">
            First Name
          </label>
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

        <div className="form-div">
          <label htmlFor="last_name" className="form-label">
            Last Name
          </label>
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

        <div className="form-div">
          <label htmlFor="mantra" className="form-label">
            Mantra
          </label>
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

        <div className="form-div">
          <label htmlFor="phone_contact" className="form-label">
            Contact
          </label>
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

        <div className="form-div">
          <label htmlFor="title" className="form-label">
            Title
          </label>
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
        <div className="form-div">
          <label htmlFor="date_of_birth" className="form-label">
            Date of Birth
          </label>
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
        <div className="update-account-container">
          {/* <input type="submit" /> */}
          <button className="update-btn" type="submit">
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
