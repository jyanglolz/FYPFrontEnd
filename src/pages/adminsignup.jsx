import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/loadingscreen';
import { reactLocalStorage } from 'reactjs-localstorage';


const AdminSignUpPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
    });

    const [loading, setLoading] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [usernameValid, setUsernameValid] = useState(true);
    const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
    const navigate = useNavigate();

    // Add state for staff and superuser status
    const [isStaff, setIsStaff] = useState(false);
    // const [isSuperuser, setIsSuperuser] = useState(false);

    useEffect(() => {
        const token = reactLocalStorage.get("token");

        if (token) {
            axios.defaults.headers.common.Authorization = `Token ${token}`;
        }

        launchFunc();
    }, []); // Empty dependency array ensures that this effect runs only once on mount

    const launchFunc = () => {
        // If the user is logged in, redirect to task
        if (reactLocalStorage.get("token")) {
            navigate('/task');
        }
        // Add other logic as needed
    };

    const checkUsernameValidity = async () => {
        const response = await axios.post('/mysite/checkusername', { username: formData.username });

        setUsernameValid(response.data.valid);
        setUsernameErrorMessage(response.data.message);
    };

    // Validate email format
    const validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    // Validate signup form
    const verifySignupForm = () => {
        const errorMessageReborn = [];
        let hasError = false;

        // Validate all fields

        // Email
        if (!validateEmail(formData.email)) {
            hasError = true;
            errorMessageReborn.push("Invalid email address");
        }

        // Password
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{12,}$/.test(formData.password)) {
            hasError = true;
            errorMessageReborn.push("Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character, and be at least 12 characters long");
        }

        // Confirm Password
        if (formData.confirmPassword !== formData.password) {
            hasError = true;
            errorMessageReborn.push("Reenter password incorrect");
        }

        // First Name
        if (formData.first_name.length < 1) {
            setFormData({ ...formData, nameError: true });
            hasError = true;
            errorMessageReborn.push("Please enter your first name");
        } else {
            setFormData({ ...formData, nameError: false });
        }

        // Last Name
        if (formData.last_name.length < 1) {
            setFormData({ ...formData, nameError: true });
            hasError = true;
            errorMessageReborn.push("Please enter your last name");
        } else {
            setFormData({ ...formData, nameError: false });
        }
        // Add other validations as needed

        if (hasError) {
            alert(errorMessageReborn.join("\n"));
            return false;
        } else {
            return true;
        }
    };

    const handleInputChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });

        // Check the username validity
        if (event.target.name === 'username') {
            checkUsernameValidity();
        }
    };

    const handleSignUp = () => {
        setLoading(true);

        // Check the username validity
        checkUsernameValidity();

        // Verify the signup form and username validity
        if (!verifySignupForm() || !usernameValid) {
            setLoading(false);
            return;
        }

        // Verify the signup form
        if (!verifySignupForm()) {
            setLoading(false);
            return;
        }

        const payload = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            first_name: formData.first_name,
            last_name: formData.last_name,
            is_staff: isStaff,
            // is_superuser: isSuperuser,
        };

        axios
            .post('/mysite/adminsignup', qs.stringify(payload), { timeout: 15000 })
            .then(async (response) => {
                alert('Signed up successfully!');
                setSignupSuccess(true);
                setLoading(false);
                navigate('/signin');
            })
            .catch((error) => {
                console.error('Error signing up:', error);
                alert('Error signing up');
                setLoading(false);
            });
    };

    return (
        <div>
            <Helmet>
                <title>Admin Sign Up Page</title>
                <meta name="title" content="Admin Sign Up Page" />
            </Helmet>
            <div style={styles.container}>
                <div style={styles.background} />
                {/* {loading ? <LoadingScreen /> : null} */}
                <div style={styles.content}>
                    <h1 style={{ ...styles.title, color: '#000', paddingTop:'75px' }}>Admin Sign Up</h1>
                    <form style={styles.form}>
                        <label style={{ ...styles.label, color: '#000', gap: '10px', marginRight: '20px' }}>
                            Username:
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                style={{ ...styles.input, color: '#000' }}
                            />
                        </label>
                        {usernameErrorMessage && <p style={{ color: 'red' }}>{usernameErrorMessage}</p>}
                        <br />
                        <label style={{ ...styles.label, color: '#000', gap: '10px', marginRight: '20px' }}>
                            Email:
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                style={{ ...styles.input, color: '#000' }}
                            />
                        </label>
                        <br />
                        <label style={{ ...styles.label, color: '#000', gap: '10px', marginRight: '20px' }}>
                            Password:
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                style={{ ...styles.input, color: '#000' }}
                            />
                        </label>
                        <br />
                        <label style={{ ...styles.label, color: '#000', gap: '10px', marginRight: '20px' }}>
                            Confirm Password:
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                style={{ ...styles.input, color: '#000' }}
                            />
                        </label>
                        <br />
                        <label style={{ ...styles.label, color: '#000', gap: '10px', marginRight: '20px' }}>
                            First Name:
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleInputChange}
                                style={{ ...styles.input, color: '#000' }}
                            />
                        </label>
                        <br />
                        <label style={{ ...styles.label, color: '#000', gap: '10px', marginRight: '20px' }}>
                            Last Name:
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleInputChange}
                                style={{ ...styles.input, color: '#000' }}
                            />
                        </label>

                        <div>
                            {/* Form fields for staff and superuser status */}
                            <label>
                                <span style={{ fontWeight: 'bold', color: 'black' }}>Staff Status:</span>
                                <input
                                    type="checkbox"
                                    checked={isStaff}
                                    onChange={() => setIsStaff(!isStaff)}
                                />
                            </label>
                            {/* <br />
                            <label>
                                <span style={{ fontWeight: 'bold', color: 'black' }}>Superuser Status:</span>
                                <input
                                    type="checkbox"
                                    checked={isSuperuser}
                                    onChange={() => setIsSuperuser(!isSuperuser)}
                                />
                            </label>
                            <br /> */}

                        </div>

                        <br />
                        <button type="button" onClick={handleSignUp} disabled={loading} style={{ ...styles.button, backgroundColor: '#28a745' }}>
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    background: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url("https://app-cdn.clickup.com/login__bg.8e44616319b55ac1.svg")', // Replace with your background image URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.5, // Adjust the opacity as needed
        zIndex: -1,
    },
    content: {
        zIndex: 1,
        textAlign: 'center',
        color: '#fff', // Adjust text color based on your background
    },
    title: {
        fontFamily: 'Arial, sans-serif',
        fontSize: '2rem',
        marginBottom: '20px',
    },
    form: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    },
    label: {
        display: 'block',
        marginBottom: '10px',
    },
    input: {
        width: '100%',
        padding: '8px',
        marginBottom: '15px',
    },
    button: {
        color: '#fff',
        padding: '10px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
    },
};

export default AdminSignUpPage;
