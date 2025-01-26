import React from "react";
import { useLocation } from 'react-router-dom';
import "./SearchScreen.css";
import Navbar from "../Navbar/Navbar"; // Make sure this path is correct

function SearchScreen({ isDarkMode, toggleMode }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query");
  const queryJwtParams = new URLSearchParams(window.location.search);
  const jwt = queryJwtParams.get('jwt');

  return (
    <div className={`SearchScreen ${isDarkMode ? "dark" : "light"}`}>
      {/* Include Navbar and pass the necessary props */}
      <Navbar isDarkMode={isDarkMode} toggleMode={toggleMode} jwt={jwt} />

      <h1>{searchQuery}</h1>
      {/* Your content goes here */}
    </div>
  );
}

export default SearchScreen;