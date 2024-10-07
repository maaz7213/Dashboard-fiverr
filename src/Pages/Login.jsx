import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';  // Import Axios for API calls
import './login&signup.css';
import { URL } from './URL';

const Login = () => {
	const navigate = useNavigate(); // Initialize the hook to navigate programmatically
	const [formData, setFormData] = useState({
		email: '',
		password: '',  // Added password field for security
	});
	const [error, setError] = useState(''); // For displaying error messages
	
	const handleChange = (e) => {
		const { id, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[id]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');  // Reset error state

		try {
			// Perform API call to authenticate user
			const response = await axios.post(`${URL}/login`, {
				email: formData.email,
				password: formData.password,
			});
			
			// If login is successful, store token (if any) and navigate to dashboard
			const { user } = response.data;

			// Assuming your API returns a token, store it in localStorage (or any storage mechanism)
			localStorage.setItem('ID', user._id);

			// Redirect to the dashboard
			navigate('/Dashboard');
		} catch (err) {
			// Set error if login fails
			setError('Login failed. Please check your email or password.');
		}
	};

	return (
		<div className="wrapper signIn">
			<div className="form">
				<div className="heading">LOGIN</div>
				{error && <p className="error">{error}</p>}  {/* Display error message */}
				<form onSubmit={handleSubmit}>
					<div>
						<label htmlFor="email">E-Mail</label>
						<input
							type="email"
							id="email"
							value={formData.email}
							onChange={handleChange}
							placeholder="Enter your email"
							required
						/>
					</div>
					<div>
						<label htmlFor="password">Password</label>
						<input
							type="password"
							id="password"
							value={formData.password}
							onChange={handleChange}
							placeholder="Enter your password"
							required
						/>
					</div>
					<button type="submit">Submit</button>
				</form>
				<p>
					Don't have an account? <Link to="/signup">Sign Up</Link>
				</p>
			</div>
		</div>
	);
};

export default Login;
