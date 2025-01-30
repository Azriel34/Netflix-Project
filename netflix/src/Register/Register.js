import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { port } from '../index';

const SignUp = () => {
    const [formData, setFormData] = useState({
        email: '',
        phoneNumber: '',
        userName: '',
        passWord: '',
        fullName: '',
        picture: null,
    });

    const [passwordVisible, setPasswordVisible] = useState(false); // New state for password visibility
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const userNameParam = params.get('userName');
        if (userNameParam) {
            setFormData((prev) => ({ ...prev, userName: userNameParam }));
        }
    }, [location]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === 'picture' && files ? files[0] : value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: '', // Clear error message for the field being edited
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email.';
        }
        if (!formData.phoneNumber || !/^\d+$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = 'Please enter a valid phone number.';
        }
        if (!formData.userName || formData.userName.length < 4 || formData.userName.length > 20) {
            newErrors.userName = 'Your Username must contain between 4 and 20 characters.';
        }
        if (!formData.fullName) newErrors.fullName = 'Full name is required.';
        if (!formData.passWord || formData.passWord.length < 4 || formData.passWord.length > 60) {
            newErrors.passWord = 'Password must be between 4 and 60 characters.';
        }
        return newErrors;
    };

    const handleSignUp = (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        axios
            .post(`http://localhost:${port}/api/users/`, formData)
            .then(() => {
                alert("User created successfully! You can now sign in.");
                navigate('/login');
            })
            .catch((err) => {
                if (err.response && err.response.data) {
                    const { error, message } = err.response.data;
                    setErrors({ serverError: error || message || "An unexpected error occurred." });
                } else {
                    setErrors({ serverError: "An unexpected error occurred. Please try again later." });
                }
            });
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="sign-up-page">
            <div className="sign-up-navbar">
                <img
                    src="/netflix_logo.png"
                    alt="Netflix Logo"
                    className="sign-up-logo"
                    onClick={() => navigate('/')}
                />
            </div>

            <div className="sign-up-content">
                <div className="sign-up-form-container">
                    <h1>Sign Up</h1>
                    {errors.serverError && (
                        <div className="error-banner">
                            <p>{errors.serverError}</p>
                        </div>
                    )}
                    <form onSubmit={handleSignUp}>
                        {['email', 'phoneNumber', 'userName', 'fullName'].map((field) => (
                            <div className="sign-up-form-group" key={field}>
                                <input
                                    type="text"
                                    name={field}
                                    className={`sign-up-input ${errors[field] ? 'sign-up-input-error' : ''}`}
                                    placeholder={capitalizeFirstLetter(field)}
                                    value={formData[field]}
                                    onChange={handleChange}
                                />
                                {errors[field] && <span className="sign-up-error-message">{errors[field]}</span>}
                            </div>
                        ))}
                        <div className="sign-up-form-group password-wrapper">
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                name="passWord"
                                className={`sign-up-input ${errors.passWord ? 'sign-up-input-error' : ''}`}
                                placeholder="Password"
                                value={formData.passWord}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={togglePasswordVisibility}
                            >
                                {passwordVisible ? '🚫' : '👁️'}
                            </button>
                            {errors.passWord && <span className="sign-up-error-message">{errors.passWord}</span>}
                        </div>
                        <div className="sign-up-form-group">
                            <input
                                type="file"
                                name="picture"
                                className="sign-up-input"
                                onChange={handleChange}
                            />
                        </div>
                        <button type="submit" className="sign-up-button">
                            Sign Up
                        </button>
                        <div className="sign-up-already-signed-in">
                            <p>
                                Already signed in? <a href="/login">Sign in now.</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            <div className="sign-up-background">
                <div className="sign-up-overlay"></div>
            </div>
        </div>
    );
};

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export default SignUp;
