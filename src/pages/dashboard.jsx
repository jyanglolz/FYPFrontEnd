import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { reactLocalStorage } from 'reactjs-localstorage';
import { Helmet } from 'react-helmet';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = reactLocalStorage.get("token");
        if (!token) {
            navigate('/login'); // Redirect if user is not logged in
            return;
        }

        axios.defaults.headers.common.Authorization = `Token ${token}`;
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/mysite/getuserdata');
                const joinedDate = new Date(response.data.date_joined);
                const formattedDate = `${joinedDate.getFullYear()}-${String(joinedDate.getMonth() + 1).padStart(2, '0')}-${String(joinedDate.getDate()).padStart(2, '0')}`;
                response.data.date_joined = formattedDate; // Update the date format
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [navigate]);

    return (
        <div style={styles.container}>
            <Helmet>
                <title>Dashboard</title>
                <meta name="title" content="Dashboard Page" />
            </Helmet>
            <div style={styles.background} />
            <div style={styles.content}>
                <h1>Welcome to Your Dashboard</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div style={styles.userData}>
                        <p><strong>Username:</strong> {userData.username}</p>
                        <p><strong>Email:</strong> {userData.email}</p>
                        <p><strong>First Name:</strong> {userData.first_name}</p>
                        <p><strong>Last Name:</strong> {userData.last_name}</p>
                        <p><strong>Joined on:</strong> {userData.date_joined}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
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
        opacity: 0.5, // Adjust the opacity as needed
        zIndex: -1,
    },
    content: {
        maxWidth: '600px',
        padding: '20px',
        backgroundColor: '#ffffcc',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    userData: {
        marginTop: '20px',
        textAlign: 'left',
    },
};

export default DashboardPage;
