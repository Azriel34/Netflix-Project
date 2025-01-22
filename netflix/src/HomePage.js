import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';
import {port} from './index'

const HomePage = () => {
  const [userName, setusername] = useState('');
  const [error, setError] = useState(''); // State for the error message
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/Login');
  };

  const handleGetStarted = () => {
    // Validate the username
    if (!userName || userName.length < 4 || userName.length > 20) {
      setError('Username must be between 4 and 20 characters.'); // Set error
      return;
    } else {
      setError(''); // Clear error if valid
    }

    // Check if username exists
    axios
      .post(`http://localhost:${port}/api/users/exists`, { userName: userName })
      .then((response) => {

        console.log(response.data);
        if (response.data.exists) {
          navigate(`/Login?userName=${encodeURIComponent(userName)}`);
        } else {
          navigate(`/Register?userName=${encodeURIComponent(userName)}`);
        }
      })
      .catch((err) => {
        console.error('Error checking if user exists:', err);
      });
  };

  return (
    <div className="homepage">
      <div className="homepage-navbar">
        <div className="homepage-logo-container">
          <img
            src="/netflix_logo.png"
            alt="Netflix Logo"
            className="homepage-netflix-logo"
          />
        </div>
        <button
          className="homepage-sign-in-button"
          onClick={handleSignIn}
        >
          Sign In
        </button>
      </div>

      <div className="homepage-background">
        <div className="homepage-background-overlay"></div>
        <img
          src="/netflix_background.jpg"
          alt="Netflix Background"
          className="homepage-background-image"
        />
      </div>

      <div className="homepage-content">
        <h1 className="homepage-title">Unlimited movies, TV shows, and more</h1>
        <h2 className="homepage-subtitle">
          Starts at ₪32.90. Cancel anytime.
        </h2>
        <p className="homepage-cta-text">
          Ready to watch? Enter your username to create or restart your membership.
        </p>
        <div className="homepage-userName-input-container">
          <input
            type="text"
            className={`homepage-userName-input ${error ? 'input-error' : ''}`} // Add error class if needed
            placeholder="Username"
            value={userName}
            onChange={(e) => setusername(e.target.value)}
          />
          <button
            className="homepage-get-started-button"
            onClick={handleGetStarted}
          >
            Get Started &gt;
          </button>
        </div>
        {error && <div className="homepage-error-message">{error}</div>} {/* Display error */}
      </div>
    </div>
  );
};

export default HomePage;
