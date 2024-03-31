import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import { Helmet } from 'react-helmet';
import Logo1 from "/assets/images/logo1.png";

const HomePage = () => {
    useEffect(() => {
        const token = reactLocalStorage.get("token");

        if (token) {
          axios.defaults.headers.common.Authorization = `Token ${token}`;
        }

        // launchFunc();
    }, []); // Empty dependency array ensures that this effect runs only once on mount

    // const launchFunc = () => {
    //     // If the user is logged in, redirect to task
    //     if (reactLocalStorage.get("token")) {
    //         navigate('/task');
    //     }
    //     // Add other logic as needed
    // };

    const navigate = useNavigate();

    return (
        <div>
            <div style={styles.container}>
                <Helmet>
                    <title>Home Page</title>
                    <meta name="title" content="Home Page" />
                </Helmet>
                <div style={styles.background} />
                <div style={styles.content}>
                    {/* Add the logo */}
                    <img src={Logo1} alt="Logo" style={styles.logo} />
                    <h1 style={styles.title}>Welcome to Task Management Web Application - SecuTask</h1>
                    {/* Button to navigate to the Signup Page */}
                    <Link to="/signup" style={styles.link}>
                        <button style={styles.button}>Go to Signup</button>
                    </Link>
                    {/* Additional sentence for assistance */}
                    <p style={styles.assistance}>
                        If you face any issues, feel free to email us at <a href="mailto:kongjunyang1@gmail.com">kongjunyang1@gmail.com</a> for further assistance.
                    </p>
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
        backgroundImage: 'url("/assets/images/homepage.png")', // Replace with your background image URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.5,
        zIndex: -1,
    },
    content: {
        zIndex: 1,
        textAlign: 'center',
        color: '#fff',
        marginRight: '1000px', // Add margin to the right side
    },
    title: {
        fontFamily: 'Arial, sans-serif',
        fontSize: '2rem',
        marginBottom: '20px',
        color: '#000',  // Set color to black
    },
    link: {
        textDecoration: 'none',
    },
    button: {
        backgroundColor: '#007BFF',
        color: '#fff',
        padding: '10px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
    },
    logo: {
        width: '500px', // Adjust logo width as needed
        marginBottom: '20px', // Add spacing between logo and title
    },
    assistance: {
        marginTop: '20px', // Add spacing between button and assistance text
        fontSize: '1.1rem',
        color: '#000',
    },
};

export default HomePage;
