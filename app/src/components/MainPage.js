import React from "react";
import banner from "../assets/banner.jpg";
import "./mainpage.css";
import { Link} from 'react-router-dom'
const MainPage = () => {
  return (
    <>
      <div className="main-page" id="Home">
        <nav className="main-nav">
          <div className="nav-logo">
            <a href="#">HRS.io</a>
          </div>
          <ul className="nav-list">
            <li className="link">Home</li>
            <li className="link">About</li>
            <li className="link">Contact Us</li>
            <Link className="link" to={"/Login"}>LOGIN</Link>
          </ul>
        </nav>
        <div className="main-container">
          <div className="left-col">
            <div className="content">
              <h1 className="main-title">WELCOME TO HRS</h1>
              <p className="main-paragraph">
                Introducing HRS, a sophisticated Human Resource Management
                system meticulously crafted to elevate efficiency and streamline
                operations across diverse professional landscapes. Tailored to
                meet the dynamic demands of modern workplaces, HRS seamlessly
                integrates cutting-edge technology with intuitive design,
                empowering organizations to optimize their human capital with
                unparalleled grace and precision.
              </p>
            </div>
            <div className="main-buttons">
              <button className="about">
                <a href="#Features">Features</a>
              </button>
              <button className="contact-us">
                <a href="#Contacts">Contact Us</a>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="main-about" id="Features">
        <div className="about-wrapper">
          <div className="services">
            <h1 className="our-services">
              Our Services<span className="serv"></span>
            </h1>
            <div className="service-cards">
              <div className="service-card">
                <i className="ri-shake-hands-fill"></i>
                <h2>Onboarding</h2>
                <p>
                  Seamlessly integrate new team members with our intuitive
                  onboarding feature, streamlining the process from offer
                  acceptance to orientation, ensuring a smooth transition into
                  your organization's culture and workflow
                </p>
              </div>
              <div className="service-card">
                <i className="ri-bank-card-2-line"></i>
                <h2>Automated Payslips</h2>
                <p>
                  Simplify payroll management with our automated payslip
                  generation tool, effortlessly producing accurate and detailed
                  compensation statements for each employee, enhancing
                  transparency and efficiency in financial transactions.
                </p>
              </div>
              <div className="service-card">
                <i className="ri-rest-time-line"></i>
                <h2>Leave Tracker</h2>
                <p>
                  Empower your workforce with convenient leave management
                  capabilities, allowing employees to effortlessly submit,
                  track, and manage their leave requests while providing
                  administrators with a streamlined approval process, ensuring
                  optimal staffing and productivity.
                </p>
              </div>
              <div className="service-card">
                <i className="ri-line-chart-fill"></i>
                <h2>Goal Tracker</h2>
                <p>
                  Foster professional growth and development within your
                  organization with our comprehensive goals and sessions
                  feature, enabling employees and managers to collaboratively
                  set, track, and evaluate performance objectives, fostering a
                  culture of continuous improvement and achievement.
                </p>
              </div>
              <div className="service-card">
                <i className="ri-profile-line"></i>
                <h2>Employee Profiles</h2>
                <p>
                  Elevate employee engagement and satisfaction with personalized
                  accounts, empowering individuals to customize their profiles,
                  access relevant information, and manage preferences, enhancing
                  their overall experience within your organization's digital
                  ecosystem.
                </p>
              </div>
              <div className="service-card">
                <i className="ri-user-add-fill"></i>
                <h2>Hiring</h2>
                <p>
                  Streamline your hiring process with our vacancies and
                  recruitments module, providing a centralized platform to post
                  job openings, manage applications, and facilitate candidate
                  evaluation and selection, ensuring a seamless and efficient
                  recruitment experience for both employers and job seekers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="main-contact-us" id="Contacts">
        <div className="footer-container">
          <div className="row">
            <div className="footer-col">
              <h4>HRS</h4>
              <ul>
                <li className="links">
                  <a href="#Home">Home</a>
                </li>
                <li className="links">
                  <a href="#Features">Features</a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Contacts</h4>
              <ul>
                <li>
                  <i className="ri-customer-service-fill"></i>
                  000-132-877-090
                </li>
                <li>
                  <i className="ri-customer-service-fill"></i>
                  009-888-122-999
                </li>
                <li>
                  <i className="ri-customer-service-fill"></i>
                  993-455-877-122
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Newsletter</h4>
              <form action="" className="newsletter">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="inputName"
                />
                <input
                  type="email"
                  placeholder="Enter Company Email"
                  className="inputEmail"
                />
                <button className="inputButton" type="submit">
                  Submit
                </button>
              </form>
            </div>
          </div>
          <hr className="line" />
          <p className="copyright">2024 HRS. All Rights Reserved</p>
        </div>
      </div>
    </>
  );
};

export default MainPage;
