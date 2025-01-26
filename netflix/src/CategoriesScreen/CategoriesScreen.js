import React, { useState, useEffect } from "react";
import "./CategoriesScreen.css";
import Navbar from "../Navbar/Navbar"; // Make sure this path is correct
import {port} from '../index';

function CategoriesScreen({ isDarkMode, toggleMode }) {
  const [permissionError, setPermissionError] = useState(null); // State to store permission error message
  const queryParams = new URLSearchParams(window.location.search);
  const jwt = queryParams.get('jwt');

  // Check permission when jwt is available
  useEffect(() => {
    if (jwt) {
      // Fetch request with the Authorization header
      fetch(`http://localhost:${port}/api/categories`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      })
        .then(response => {
          if (!response.ok) {
            // If the response is not OK, check if it's a JSON error
            return response.json().then(err => {
              setPermissionError(err.message || "You don't have permission to be here, please sign in");
            });
          }
          // If the response is OK, set the permission message
          setPermissionError(null); // No permission error
        })
        .catch(() => {
          setPermissionError("An error occurred while checking your permission.");
        });
    } else {
      setPermissionError("You don't have permission to be here, please sign in");
    }
  }, [jwt]);

  return (
    <div className={`CategoriesScreen ${isDarkMode ? "dark" : "light"}`}>
      {/* Include Navbar and pass the necessary props */}
      <Navbar isDarkMode={isDarkMode} toggleMode={toggleMode} jwt={jwt} />

      {/* Conditional rendering based on permission error */}
      {permissionError ? (
        <h1>{permissionError}</h1>
      ) : (
        <h1>Good: You have permission to access categories</h1>
      )}
    </div>
  );
}

export default CategoriesScreen;