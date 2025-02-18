import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { retrieve } from "../Encryption";

const HeaderManager = () => {
  const navigate = useNavigate();
  function handleLogout(e) {
    fetch("https://hrs-iymg.onrender.com/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + retrieve().access_token,
        Accept: "application/json",
      },
    }).then((resp) => {
      if (resp.ok) {
        localStorage.clear();
        navigate("/login");
      }
    });
  }
  return (
    <div>
      {/* Navbar */}
      <nav
        className="main-header navbar navbar-expand navbar-white navbar-light"
        style={{ backgroundColor: "#0D98BA" }}
      >
        {/* Left navbar links */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="pushmenu"
              href="#"
              role="button"
            >
              <i className="fas fa-bars" />
            </a>
          </li>
          <li
            className="nav-item d-none d-sm-inline-block"
            style={{ marginTop: "10px" }}
          >
            <Link to={"/"} style={{ color: "white" }}>
              Home
            </Link>
          </li>
        </ul>
        {/* Right navbar links */}
        <ul className="navbar-nav ml-auto">
          {/* Navbar Search */}
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="navbar-search"
              href="#"
              role="button"
            >
              <i className="fas fa-search" />
            </a>
            <div className="navbar-search-block">
              <form className="form-inline">
                <div className="input-group input-group-sm">
                  <input
                    className="form-control form-control-navbar"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                  />
                  <div className="input-group-append">
                    <button className="btn btn-navbar" type="submit">
                      <i className="fas fa-search" />
                    </button>
                    <button
                      className="btn btn-navbar"
                      type="button"
                      data-widget="navbar-search"
                    >
                      <i className="fas fa-times" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </li>

          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="fullscreen"
              href="#"
              role="button"
            >
              <i className="fas fa-expand-arrows-alt" />
            </a>
          </li>
          <li
            className="nav-item"
            style={{
              margin: "8px 10px",
              fontSize: "1.5rem",
              color: "#fff",
              cursor: "pointer",
            }}
            onClick={handleLogout}
          >
            <i class="ri-logout-box-r-line"></i>
          </li>
        </ul>
      </nav>
      {/* /.navbar */}
    </div>
  );
};

export default HeaderManager;
