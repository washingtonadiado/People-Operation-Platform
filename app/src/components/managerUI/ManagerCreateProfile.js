import React, {useState  } from 'react'
import './managerEdit.css'
import { useNavigate, useParams } from 'react-router-dom';
import { retrieve } from '../Encryption';
import { useFormik } from 'formik';
import * as yup from "yup"

const ManagerCreateProfile = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { managerId } = useParams()

  const [profilePhoto, setProfilePhoto] = useState(null);

  // image upload check size and extension type
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
      first_name: yup.string().required("First name is required"),
      last_name: yup.string().required("Last name is required"),
      mantra: yup.string().required("Mantra is required"),
      phone_contact: yup
        .string()
        .required("Phone contacts are required")
        .min(10, "Phone contact must be atleast 10 characters"),
      title: yup.string().required("Title is required"),
      date_of_birth: yup.date().required("Date of birth is required"),
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
      
      console.log("Form data before making the POST request:",...formData.entries());

      fetch("https://hrs-iymg.onrender.com/managerProfiles", {
        method: "POST",
        headers: {
          'Authorization': "Bearer " + retrieve().access_token,
        },
        body: formData,
      }).then((response) => {
        if (response.ok) {
          // clear out form fields
          formik.resetForm();
          //set success message
          setSuccess("Successfully created account!!");
          //navigate user to home page
          setTimeout(() => {
            navigate("/manager/manager_profile");
          }, 2000);
          response.json().then((data) => console.log(data));
        } else {
          return response.json().then((err) => console.log(err));
        }
        console.log("After making the POST request");
      });
    },
  });

  return (
    <div className='content-wrapper-manager' >
    <div className="container-manager">
      <div className="form-container-manager">
        <form className="profile-form-manager" onSubmit={formik.handleSubmit}>
          {success ? <h4 className="secondary-title-manager">{success}</h4> : null}
          <div className="form-control">
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
          <div className="form-control-manager">
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

          <div className="form-control-manager">
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

          <div className="form-control-manager">
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

          <div className="form-control-manager">
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

          <div className="form-control-manager">
            <label htmlFor="title">Title</label>
            <br />
            <input
              type="text"
              id="title"
              name="title"
              placeholder="eg. Mr. Mrs"
              value={formik.values.title}
              onChange={formik.handleChange}
            />
            {formik.touched.title && formik.errors.title ? (
              <div className="error">{formik.errors.title}</div>
            ) : null}
          </div>
          <div className="form-control-manager">
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
          <div className="update-account-container-manager">
            {/* <input type="submit" /> */}
            <button className="update-btn-manager" type="submit">
              Create Profile
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  )
}

export default ManagerCreateProfile