import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./Navbar.css";
import logo from "./logo.svg"; 

function Navbar({ userName, isDarkMode, toggleMode ,jwt}) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchQuery}&jwt=${jwt}`);
  };

  return (
    <div className={`navbar`}>
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <Link to={`/home?jwt=${jwt}`}>
          <button className="nav-button">Home</button>
        </Link>

        <Link to={`/categories?jwt=${jwt}`}>
          <button className="nav-button">Categories</button>
        </Link>
      </div>

      <div className="navbar-center">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search..."
            className="search-box"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </form>
      </div>

      <div className="navbar-right">
      <Link to={`/manager?jwt=${jwt}`}>
      <button className="manager-button">Manager</button>
        </Link>
        <span className="username">{userName}</span>
        <Link to="/">
        <button className="logout-button">Logout</button>
        </Link>

        <div className="toggle-switch">
          <label className="switch">
            <input type="checkbox" checked={isDarkMode} onChange={toggleMode} />
            <span className="slider"></span>
          </label>
          <span className="toggle-label">
            {isDarkMode ? "Dark Mode" : "Light Mode"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Navbar;