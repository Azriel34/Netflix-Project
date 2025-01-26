import React from 'react';
import "./ManagerScreen.css";
import Navbar from "../Navbar/Navbar"; // Make sure this path is correct

function ManagerScreen({ isDarkMode, toggleMode }) {
  const queryJwtParams = new URLSearchParams(window.location.search);
  const jwt = queryJwtParams.get('jwt');


  return (
    <div className={`ManagerScreen ${isDarkMode ? "dark" : "light"}`}>
      {/* Include Navbar and pass the necessary props */}
      <Navbar isDarkMode={isDarkMode} toggleMode={toggleMode} jwt={jwt}/>

      <h1>Manager</h1>
      {/* Your content goes here */}
    </div>
  );
}

export default ManagerScreen;