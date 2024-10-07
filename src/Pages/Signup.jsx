import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";  // Import Axios for API call
import './login&signup.css';
import { URL } from "./URL";

const Signup = () => {
  const navigate = useNavigate();  // To navigate after successful signup
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      // Make POST request to signup API
      axios.post(`${URL}/signup`, {
        username: formData.name,
        email: formData.email,
        password:formData.password
      }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log(response.data);
        navigate("/")
    })
    .catch(error => {
        console.error('Error:', error.response.data);
    });


    } catch (err) {
      // Handle any errors during signup
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className="wrapper signUp">
      <div className="form">
        <div className="heading">CREATE AN ACCOUNT</div>
        
        {error && <p className="error">{error}</p>}  {/* Display error if exists */}
        {success && <p className="success">Account created successfully! Redirecting to login...</p>}  {/* Display success if account is created */}
        
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>
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
          Have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
