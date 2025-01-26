import React from "react";
import "./CategoriesScreen.css";
import Navbar from "../Navbar/Navbar"; // Make sure this path is correct

function CategoriesScreen({ isDarkMode, toggleMode }) {
  const queryParams = new URLSearchParams(window.location.search);
  const jwt = queryParams.get('jwt');

  return (
    <div className={`CategoriesScreen ${isDarkMode ? "dark" : "light"}`}>
      {/* Include Navbar and pass the necessary props */}
      <Navbar isDarkMode={isDarkMode} toggleMode={toggleMode} jwt={jwt}/>

      <h1>Categories</h1>
      {/* Your content goes here */}
    </div>
  );
}

export default CategoriesScreen;