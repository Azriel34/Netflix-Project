import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./SearchScreen.css";
import Navbar from "../Navbar/Navbar";
import {port} from '../index';

function SearchScreen({ isDarkMode, toggleMode }) {
  const [permissionError, setPermissionError] = useState(null); // State to store permission error message
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query");
  const jwt = queryParams.get("jwt"); // Ensure we extract the correct `jwt` parameter

  // Check permission when jwt is available
  useEffect(() => {
    if (jwt) {
      // Ensure a valid fetch call with the Authorization header
      fetch(`http://localhost:${port}/api/categories`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            // Handle non-OK responses
            return response.json().then((err) => {
              setPermissionError(
                err.message || "You don't have permission to be here, please sign in"
              );
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
    <div className={`SearchScreen ${isDarkMode ? "dark" : "light"}`}>
      {/* Include Navbar and pass the necessary props */}
      <Navbar isDarkMode={isDarkMode} toggleMode={toggleMode} jwt={jwt} />

      {/* Conditional rendering based on permission error */}
      {permissionError ? (
        <h1>{permissionError}</h1>
      ) : (
        <>
          <h1>Search results for: {searchQuery}</h1>
          <p>Authorized! Here are your search results.</p>
        </>
      )}
    </div>
  );
}

export default SearchScreen;