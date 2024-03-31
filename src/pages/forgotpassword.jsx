import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';


const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
         // If the user is logged in, redirect to task
        if (localStorage.getItem("token")) {
            navigate('/task');
        }

        // Fetch CSRF token only once during component initialization
        const fetchCsrfToken = async () => {
            try {
                const response = await axios.get('/csrf-token');
                setCsrfToken(response.data.csrfToken);
            } catch (error) {
                console.error('Failed to fetch CSRF token:', error);
            }
        };
        fetchCsrfToken();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Perform forgot password logic
            const response = await axios.post(
                '/mysite/forgotpassword',
                { email, username },
                { headers: { 'X-CSRFToken': csrfToken } }
            );
            console.log(response.data); // Assuming backend returns success message
            // Handle success scenario
        } catch (error) {
            setError('Failed to initiate password reset. Please try again.'); // Update error message based on actual error
        }
        setLoading(false);
    };

    return (
        <div>
            <Helmet>
                <title>Forgot Password</title>
                <meta name="title" content="Forgot Password" />
            </Helmet>
            <div style={styles.container}>
                <div style={styles.background} />
                <div style={styles.content}>
                    <h1 style={{ color: '#000' }}>Forgot Password</h1>
                    <form onSubmit={handleSubmit}>
                        <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        <button type="submit" disabled={loading}>Reset Password</button>
                        {error && <p>{error}</p>}
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
};

export default ForgotPasswordPage;