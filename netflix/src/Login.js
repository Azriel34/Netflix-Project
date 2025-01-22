import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);

  const handleEmailBlur = () => {
    setEmailTouched(true);
    if (!email) {
      setEmailError('Please enter a valid email or phone number.');
    } else {
      setEmailError('');
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
    if (!email || emailError || !password || passwordError) return;
    navigate('/browse');
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
          <form onSubmit={handleSignIn}>
            <div className="login-input-container">
              <input
                type="text"
                className={`login-input ${emailError ? 'login-input-error' : ''}`}
                placeholder="Email or mobile number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                onFocus={() => setEmailTouched(true)}
              />
              {emailTouched && emailError && <span className="login-error-text">{emailError}</span>}
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
            <button type="submit" className="sign-in-button">
              Sign In
            </button>
            <div className="new-to-netflix">
              <p>
                New to Netflix? <a href="/SignUp"> Sign up now.</a>
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
