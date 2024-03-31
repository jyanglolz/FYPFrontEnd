import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';


const ResetPasswordPage = () => {

    useEffect(() => {
        // If the user is logged in, redirect to task
        if (reactLocalStorage.get("token")) {
            navigate('/task');
        }
    }, []); // Empty dependency array ensures that this effect runs only once on mount

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Perform reset password logic
            // Example: Send password and confirm password to backend to reset password
            const response = await axios.post('/mysite/resetpassword', { password, confirmPassword });
            console.log(response.data); // Assuming backend returns success message
            // Handle success scenario
        } catch (error) {
            setError('Failed to reset password. Please try again.'); // Update error message based on actual error
        }
        setLoading(false);
    };

    return (
        <div>
            <Helmet>
                <title>Reset Password</title>
                <meta name="title" content="Reset Password" />
            </Helmet>
            <div style={styles.container}>
                <div style={styles.background} />
                <div style={styles.content}>
                    <h1 style={{ color: '#000' }}>Reset Password</h1>
                    <form onSubmit={handleSubmit}>
                        <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        <button type="submit" disabled={loading}>Reset Password</button>
                        {error && <p>{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;

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