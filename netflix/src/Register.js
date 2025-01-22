import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { useLocation } from 'react-router-dom';

const SignUp = () => {
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        username: '',
        password: '',
        fullName: '',
        picture: null,
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const emailParam = params.get('email');
        if (emailParam) {
          setFormData((prev) => ({ ...prev, email: emailParam }));
        }
      }, [location]);
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
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
        if (!formData.phone || !/^\d+$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number.';
        }
        if (!formData.username) newErrors.username = 'Username is required.';
        if (!formData.fullName) newErrors.fullName = 'Full name is required.';
        if (!formData.password || formData.password.length < 4 || formData.password.length > 60) {
            newErrors.password = 'Password must be between 4 and 60 characters.';
        }
        return newErrors;
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            console.log('Form submitted:', formData);
            navigate('/welcome');
        }
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
                    <form onSubmit={handleSignUp}>
                        {['email', 'phone', 'username', 'fullName', 'password'].map((field) => (
                            <div className="sign-up-form-group" key={field}>
                                <input
                                    type={field === 'password' ? 'password' : 'text'}
                                    name={field}
                                    className={`sign-up-input ${errors[field] ? 'sign-up-input-error' : ''}`}
                                    placeholder={capitalizeFirstLetter(field)}
                                    value={formData[field]}
                                    onChange={handleChange}
                                />
                                {errors[field] && <span className="sign-up-error-message">{errors[field]}</span>}
                            </div>
                        ))}
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
