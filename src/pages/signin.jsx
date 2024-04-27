import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { reactLocalStorage } from 'reactjs-localstorage';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useEffect } from 'react';

const SignInPage = ({ onLogin }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

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

    const handleInputChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSignIn = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/mysite/signin', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const { message } = response.data;
            if (message === 'Login successful') {
                localStorage.setItem('Username', formData.username);
                navigate('/verify');
            } else {
                console.error('Unexpected response:', response.data);
                alert('Unexpected response. Please try again.');
            }
        } catch (error) {
            console.error('Error signing in:', error);
            alert('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Helmet>
                <title>Sign In Page</title>
                <meta name="title" content="Sign In Page" />
            </Helmet>
            <div style={styles.container}>
                <div style={styles.background} />
                <div style={styles.content}>
                    <h1 style={styles.title}>Sign In</h1>
                    <form style={styles.form}>
                        <label style={styles.label}>
                            Username:
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                style={{ ...styles.input, color: '#000' }}
                            />
                        </label>
                        <br />
                        <label style={styles.label}>
                            Password:
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                style={{ ...styles.input, color: '#000' }}
                                autoComplete="current-password"
                            />
                        </label>
                        <br />
                        <button
                            type="button"
                            onClick={handleSignIn}
                            disabled={loading}
                            style={styles.button}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                    <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
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
        backgroundImage: 'url("https://app-cdn.clickup.com/login__bg.8e44616319b55ac1.svg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.5,
        zIndex: -1,
    },
    content: {
        zIndex: 1,
        textAlign: 'center',
        color: '#fff',
    },
    title: {
        fontFamily: 'Arial, sans-serif',
        fontSize: '2rem',
        marginBottom: '20px',
        color: '#000'
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
        color: '#000'
    },
    input: {
        width: '100%',
        padding: '8px',
        marginBottom: '15px',
    },
    button: {
        backgroundColor: '#007BFF',
        color: '#fff',
        padding: '10px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
    },
};

export default SignInPage;
