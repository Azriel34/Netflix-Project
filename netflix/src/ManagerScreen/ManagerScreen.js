import React, { useState, useEffect } from 'react';
import "./ManagerScreen.css";
import Navbar from "../Navbar/Navbar"; // Make sure this path is correct
import { port } from '../index';

function ManagerScreen({ isDarkMode, toggleMode }) {
  const [permissionError, setPermissionError] = useState(null); // State to store permission error message
  const queryJwtParams = new URLSearchParams(window.location.search);
  const jwt = queryJwtParams.get('jwt');

  // Check permission when jwt is available
  useEffect(() => {
    if (jwt) {
      // Fetch request with the Authorization header
      fetch(`http://localhost:${port}/api/categories/0`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      })
        .then(response => {
          if (!response.ok) {
            // Handle non-OK responses
            return response.json().then(err => {
              // Check specific error messages
              if (err.error === "Internal server error") {
                console.log("Good");
              } else if (err.error === "Access restricted to managers only") {
                setPermissionError("You don't have permission to be here, please sign in as a manager");
              } else {
                setPermissionError(err.message || "You don't have permission to be here, please sign in as a manager");
              }
            });
          }
          // If response is OK, clear any permission errors
          setPermissionError(null);
        })
        .catch(() => {
          setPermissionError("An error occurred while checking your permission.");
        });
    } else {
      setPermissionError("You don't have permission to be here, please sign in");
    }
  }, [jwt]);

  return (
    <div className={`ManagerScreen ${isDarkMode ? "dark" : "light"}`}>
      {/* Include Navbar and pass the necessary props */}
      <Navbar isDarkMode={isDarkMode} toggleMode={toggleMode} jwt={jwt} />

      {/* Conditional rendering based on permission error */}
      {permissionError ? (
        <h1>{permissionError}</h1>
      ) : (
        <>
          <h1>Welcome to the Manager Panel</h1>
          <p>You have access to manager functionalities.</p>
        </>
      )}
    </div>
  );
}

export default ManagerScreen;