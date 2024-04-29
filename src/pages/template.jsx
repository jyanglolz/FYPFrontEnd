import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';


const TemplatePage = ({}) => {

    useEffect(() => {
        const token = reactLocalStorage.get("token");

        if (token) {
          axios.defaults.headers.common.Authorization = `Token ${token}`;
        }

        launchFunc();
    }, []); // Empty dependency array ensures that this effect runs only once on mount

    const launchFunc = () => {
        // If the user is logged in, redirect to task
        // if (reactLocalStorage.get("token")) {
        //     navigate('/task');
        // }
    };

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);


    return (
       <div>
            <Helmet>
                <title>Template</title>
                <meta name="title" content="Template Page" />
            </Helmet>

            <div style={styles.background} />
            <div style={{ paddingTop: '75px', fontSize: '30px', fontWeight: 'bold', marginLeft: '15px'}}>
                Template
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
        opacity: 0.5, // Adjust the opacity as needed
        zIndex: -1,
    },
    content: {
        zIndex: 1,
        textAlign: 'center',
        color: '#fff', // Adjust text color based on your background
    },
};

export default TemplatePage;