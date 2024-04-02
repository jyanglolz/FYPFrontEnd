import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo1 from "/assets/images/logo1.png";


const NavBar = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        // Additional: Redirect to the home page or other necessary actions
        navigate('/');

        // Additional: Notify the parent component (App.jsx) about the logout
        if (onLogout) {
            onLogout();
        }
    };

    return (
        <nav style={styles.navbar}>
            <a href="/task" style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={styles.logo}>
                    {/* Apply styles directly to the img element */}
                    <img src={Logo1} alt="Logo" style={{ width: '160px', height: 'auto' }} />
                </div>
            </a>
            <ul style={{ ...styles.navList, marginRight: '30px', marginTop: '15px' }}>
                {localStorage.getItem('Staff Status') === 'true' ? (
                    <li style={{}}>
                        <Link to="/admin" style={styles.navLink}>Admin</Link>
                    </li>
                ) : (
                    null
                )}

                <li style={{}}><Link to="/" style={styles.navLink}>Home</Link></li>

                {localStorage.getItem('token') ? (
                    null
                ) : (
                    <li><Link to="/signin" style={styles.navLink}>SignIn</Link></li>
                )}

                {localStorage.getItem('token') ? (
                    <li style={{}}><Link to="/task" style={styles.navLink}>Task</Link></li>
                ) : (
                    null
                )}

                {localStorage.getItem('token') ? (
                    <li style={{}}><Link to="/dashboard" style={styles.navLink}>Dashboard</Link></li>
                ) : (
                    null
                )}

                {localStorage.getItem('token') ? (
                    null
                ) : (
                    <li style={{ marginRight: '30px' }}><Link to="/signup" style={styles.navLink}>Signup</Link></li>
                )}

                {localStorage.getItem('token') ? (
                    <li><Link to="/" onClick={handleLogout} style={{ ...styles.navLink,}}>Logout</Link></li>
                ) : null}

            </ul>
        </nav>
    );

};


const styles = {
    navbar: {
        background: 'black',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'fixed', // Fixed position to stay at the top
        top: 0, // Top of the viewport
        left:0,
        width: '100%', // Full width
        zIndex: 1000, // Higher z-index to overlay other elements
    },
    logo: {
        color: '#fff',
        fontSize: '1.5rem',
    },
    navList: {
        listStyle: 'none',
        display: 'flex',
        gap: '20px',
    },
    navLink: {
        textDecoration: 'none',
        color: '#fff',
        fontSize: '1rem',
        fontWeight: 'bold',
    },
    logoutButton: {
        background: 'none',
        border: 'none',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
    },
};

export default NavBar;
