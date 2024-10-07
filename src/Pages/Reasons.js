import React, { useState, useEffect } from "react";
import axios from "axios"; // For API calls
import { useNavigate } from "react-router-dom";
import './reasons.css'; // We'll create this CSS file next
import { URL } from "./URL";

const Reasons = () => {
  const navigate = useNavigate(); // To navigate after submission
  const [formData, setFormData] = useState({
    email: '', // Optional: If you want to associate reasons with a user
    reason: '',
    additionalDetails: '',
  });
  const [reasonsList, setReasonsList] = useState([]); // State to hold fetched reasons
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false); // Control visibility of the form

  // Fetch reasons from API on component mount
  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const response = await axios.get(`${URL}/get_Reasons/${localStorage.getItem("ID")}`);
        setReasonsList(response.data.data); // Assuming response data contains the list of reasons
      } catch (err) {
        console.error('Error fetching reasons:', err);
        setError('Failed to fetch reasons.');
      }
    };

    fetchReasons();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const { reason, additionalDetails } = formData;

    // Basic validation
    if (!reason.trim()) {
      setError('Please enter a reason.');
      return;
    }

    try {
      // Make POST request to your API endpoint
      const response = await axios.post(
        `${URL}/reasons`, // Replace with your actual endpoint
        {
          userID: localStorage.getItem("ID"), // Optional: Include if associating with user
          reason: reason,
          additionalDetails: additionalDetails,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(response.data);
      setSuccess(true);
      // Add the new reason to the reasonsList state
      setReasonsList((prevReasons) => [...prevReasons, response.data]);
      setShowForm(false); // Hide the form after successful submission

    } catch (err) {
      // Handle errors from API
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Submission failed. Please try again.');
      }
      console.error('Error:', err);
    }
  };

  return (
    <div className="wrapper-r reasons">
      <div className="heading">SUBMITTED REASONS</div>

      {/* Display reasons */}
      <div className="reasons-list">
        <h3>Submitted Reasons</h3>
        {reasonsList.length === 0 ? (
          <p>No reasons submitted yet.</p>
        ) : (
          <ul>
            {reasonsList.map((reasonItem) => (
              <li key={reasonItem._id}>
                <div className="reason-item">
                  <strong>Reason:</strong> {reasonItem.reason} <br />
                  <strong>Additional Details:</strong> {reasonItem.additionalDetails}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add button to display the form */}
      {!showForm && (
        <button className="add-reason-btn" onClick={() => setShowForm(true)}>
          Add Reason
        </button>
      )}

      {/* Display the form only when showForm is true */}
      {showForm && (
        <div className="form">
          <div className="heading">SUBMIT YOUR REASON</div>
          
          {/* Display error if exists */}
          {error && <p className="error">{error}</p>}
          
          {/* Display success message */}
          {success && <p className="success">Reason submitted successfully!</p>}
          
          <form onSubmit={handleSubmit}>
            {/* Reason Field */}
            <div>
              <label htmlFor="reason">Reason</label>
              <textarea
                id="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Enter your reason"
                required
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="additionalDetails">Additional Details (Optional)</label>
              <textarea
                id="additionalDetails"
                value={formData.additionalDetails}
                onChange={handleChange}
                placeholder="Provide additional details if any"
              ></textarea>
            </div>
            
            <button type="submit">Submit</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Reasons;
