import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';
import axios from 'axios';
import { port } from '../index'

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [userNameError, setUserNameError] = useState('');
  const [userNameTouched, setUserNameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userNameParam = params.get('userName');
    if (userNameParam) {
      setUserName(userNameParam);
    }
  }, [location]);

  const handleuserNameBlur = () => {
    setUserNameTouched(true);
    if (!userName || userName.length < 4 || userName.length > 20) {
      setUserNameError('Your username must contain between 4 and 20 characters.');
    } else {
      setUserNameError('');
    }
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    if (!password || password.length < 4 || password.length > 60) {
      setPasswordError('Your password must contain between 4 and 60 characters.');
    } else {
      setPasswordError('');
    }
  };

  const handleSignIn = (e) => {
    e.preventDefault();

    let hasError = false;

    // Validate username
    if (!userName || userName.length < 4 || userName.length > 20) {
      setUserNameError('Your username must contain between 4 and 20 characters.');
      setUserNameTouched(true);
      hasError = true;
    } else {
      setUserNameError('');
    }

    // Validate password
    if (!password || password.length < 4 || password.length > 60) {
      setPasswordError('Your password must contain between 4 and 60 characters.');
      setPasswordTouched(true);
      hasError = true;
    } else {
      setPasswordError('');
    }

    // If there are errors, do not proceed
    if (hasError) return;

    // Make the login request
    axios
      .post(
        `http://localhost:${port}/api/tokens/`,
        { userName: userName, passWord: password },
        { withCredentials: true } // Include withCredentials to handle cookies
      )
      .then((response) => {
        // On successful login, navigate to the welcome page
        const cookie = response.data.token; // Get the cookie
        console.log(cookie)
        navigate(`/home?jwt=${cookie}`); // Pass the cookie as state
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.error) {
          // Display the error message from the backend
          setServerError(err.response.data.error);
        } else {
          setServerError('An unexpected error occurred. Please try again.');
        }
      });
  };



  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="login-page">
      <div className="login-navbar">
        <img
          src="/netflix_logo.png"
          alt="Netflix Logo"
          className="netflix-logo"
          onClick={() => navigate('/')}
        />
      </div>

      <div className="login-content">
        <div className="login-form-container">
          <h1>Sign In</h1>
          {serverError && (
            <div className="error-banner">
              <p>{serverError}</p>
            </div>
          )}
          <form onSubmit={handleSignIn}>
            <div className="login-input-container">
              <input
                type="text"
                className={`login-input ${userNameError ? 'login-input-error' : ''}`}
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onBlur={handleuserNameBlur}
                onFocus={() => setUserNameTouched(true)}
              />
              {userNameTouched && userNameError && <span className="login-error-text">{userNameError}</span>}
            </div>
            <div className="login-input-container">
              <label
                className={`floating-label ${password ? 'active' : ''}`}
                htmlFor="password"
              >
                Password
              </label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={passwordVisible ? 'text' : 'password'}
                  className={`login-input ${passwordError ? 'login-input-error' : ''}`}
                  value={password}
                  placeholder='Password'
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError('');
                  }}
                  onBlur={handlePasswordBlur}
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label="Toggle password visibility"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? '🚫' : '👁️'}
                </button>
              </div>
              {passwordTouched && passwordError && (
                <span className="login-error-text">{passwordError}</span>
              )}
            </div>
            <button type="submit" className="sign-in-button" onClick={handleSignIn}>
              Sign In
            </button>
            <div className="new-to-netflix">
              <p>
                New to Netflix? <a href="/Register"> Sign up now.</a>
              </p>
            </div>
          </form>
        </div>
      </div>

      <div className="login-background">
        <div className="background-overlay"></div>
      </div>
    </div>
  );
};

export default Login;
