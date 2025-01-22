import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/Login');
  };

  const handleGetStarted = () => {
    if (email.endsWith('@gmail.com')) {
      navigate(`/Login?email=${encodeURIComponent(email)}`);
    } else {
      navigate(`/Register?email=${encodeURIComponent(email)}`);
    }
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
          Ready to watch? Enter your email to create or restart your membership.
        </p>
        <div className="homepage-email-input-container">
          <input
            type="email"
            className="homepage-email-input"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="homepage-get-started-button"
            onClick={handleGetStarted}
          >
            Get Started &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
