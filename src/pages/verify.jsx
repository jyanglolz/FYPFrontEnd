// verify.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { reactLocalStorage } from 'reactjs-localstorage';
import { Helmet } from 'react-helmet';


const VerifyPage = () => {
 	const [formData, setFormData] = useState({
    	verificationCode: '',
  	});
  	const [loading, setLoading] = useState(false);
  	const [verificationError, setVerificationError] = useState('');
  	const navigate = useNavigate();

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
		setVerificationError(''); // Clear any previous error when the user types
 	};

	const handleVerify = async () => {
		setLoading(true);

		try {
		  	const username = localStorage.getItem('Username');

			if (!username) {
				// Handle the case where the username is not set
				console.error('Username not set in localStorage');
				alert('Please sign in first.');
				return;
			}

			const response = await axios.post('/mysite/verifyverificationcode', {
				verification_code: formData.verificationCode,
				username: username,
			});

			// Assuming the backend returns the user information and token upon successful verification
			const {message, user, token } = response.data;

			// Store user details and token in localStorage
			localStorage.setItem('Email', user.email);
			localStorage.setItem('First Name', user.first_name);
			localStorage.setItem('Last Name', user.last_name);
			localStorage.setItem('Staff Status', user.is_staff);
			localStorage.setItem('token', token);

			// Redirect to the task page after successful verification
			alert('Account Verification Successful!');
			navigate('/task');
		} catch (error) {
			console.error('Error verifying code:', error);
			setVerificationError('Invalid verification code. Please try again.'); // Set error message
		} finally {
		  setLoading(false);
		}
	};

	return (
		<div>
			<Helmet>
                <title>Verify Page</title>
                <meta name="title" content="Verify Page" />
            </Helmet>
				<div style={styles.container}>
				<div style={styles.background} />
				<div style={styles.content}>
					<h1 style={{ color: '#000' }}>Verify Your Account</h1>
					<p style={{ color: '#000' }}>Enter the verification code sent to your email to complete the verification process.</p>
					<form>
					<label style={{ color: '#000', fontSize: '1.2rem', marginLeft: '15px' }}>
						Verification Code:
						<input
							type="text"
							name="verificationCode"
							value={formData.verificationCode}
							onChange={handleInputChange}
							style={{ marginLeft: '10px' }}
						/>
					</label>
						<br />
						<button
							type="button"
							onClick={handleVerify}
							disabled={loading}
							style={{
								backgroundColor: '#11ae65',
								color: '#fff',
								padding: '10px',
								borderRadius: '4px',
								cursor: 'pointer',
								fontSize: '1rem',
								marginTop: '15px' // Added marginTop inline
							}}
						>
							{loading ? 'Verifying...' : 'Verify'}
						</button>
					</form>
					{verificationError && <p style={{ color: 'red' }}>{verificationError}</p>}
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

export default VerifyPage;
