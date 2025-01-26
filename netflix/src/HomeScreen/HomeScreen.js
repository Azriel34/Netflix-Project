import React from 'react';
import "./HomeScreen.css"; 
import Navbar from "../Navbar/Navbar"; // Make sure this path is correct

function HomeScreen({ isDarkMode, toggleMode }) {
  const queryParams = new URLSearchParams(window.location.search);
  const jwt = queryParams.get('jwt');

  return (
    <div className={`HomeScreen ${isDarkMode ? "dark" : "light"}`}>
      {/* Include Navbar and pass the necessary props */}
      <Navbar isDarkMode={isDarkMode} toggleMode={toggleMode} jwt={jwt} />

      <h1>Home</h1>
      {/* Your content goes here */}
    </div>
  );
}

export default HomeScreen;