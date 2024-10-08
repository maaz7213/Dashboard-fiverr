import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Operators.css'; // Import CSS
import { URL } from './URL.js'; // Import your URL file

const OperatorList = () => {
  const [operatorName, setOperatorName] = useState(''); // For the current input
  const [operators, setOperators] = useState([]); // For the list of operators
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(''); // To handle any errors
  const [successMessage, setSuccessMessage] = useState(''); // To show success messages
  const [showForm, setShowForm] = useState(false); // State to control the visibility of the form

  // Fetch operators when the component mounts
  useEffect(() => {
    axios.get(`${URL}/get_operators_by_userid/${localStorage.getItem('ID')}`)
      .then(response => {
        setOperators(response.data.operators); // Set the operators data
        setLoading(false); // Stop loading
      })
      .catch(err => {
        setError('Error fetching operators');
        setLoading(false); // Stop loading in case of error
      });
  }, []);

  // Handle input changes for adding an operator
  const handleInputChange = (e) => {
    setOperatorName(e.target.value); // Update the operatorName state with the input value
  };

  // Handle adding a new operator
  const handleAddOperator = () => {
    if (operatorName.trim() !== '') { // Make sure input is not empty
      // Send the operatorName to the backend
      axios.post(`${URL}/add_operator`, { name: operatorName, userID: localStorage.getItem("ID") })
        .then(response => {
          // If successfully added, update the UI
          setOperators([...operators, response.data]); // Add the new operator from the response
          setOperatorName(''); // Clear the input field
          setSuccessMessage('Operator added successfully'); // Show success message
          setError(''); // Clear any errors
          setShowForm(false); // Hide the form after adding the operator
        })
        .catch(error => {
          setError('Error adding operator. Please try again.');
          setSuccessMessage(''); // Clear the success message if there's an error
          console.error('Error:', error);
        });
    } else {
      setError('Operator name cannot be empty');
    }
  };

  // Display loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  // Display error state
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="operator-list">
      <h2>Operators for User ID: {localStorage.getItem('ID')}</h2>

      {/* Add operator section */}
      {!showForm && (
        <button onClick={() => setShowForm(true)}>Add Operator</button>
      )}

      {showForm && (
        <div className="input-container">
          <input
            type="text"
            value={operatorName}
            onChange={handleInputChange}
            placeholder="Enter operator name"
          />
          <button onClick={handleAddOperator}>Submit</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}

      {error && <p className="error-message">{error}</p>} {/* Display error messages */}
      {successMessage && <p className="success-message">{successMessage}</p>} {/* Display success messages */}

      {/* Display operators list */}
      {operators.length === 0 ? (
        <p>No operators found for this user.</p>
      ) : (
        <ul>
          {operators.map((operator, index) => (
            <li key={index}>
              <p><strong>Operator Name:</strong> {operator.name}</p>
              <p><strong>Operator ID:</strong> {operator._id}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OperatorList;
 