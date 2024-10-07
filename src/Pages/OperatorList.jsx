// import React, { useState } from 'react';
// import './operator.css'
// const OperatorList = () => {
//   const [operatorName, setOperatorName] = useState(''); // For the current input
//   const [operators, setOperators] = useState([]); // For the list of operators

//   const handleInputChange = (e) => {
//     setOperatorName(e.target.value); // Update the operatorName state with the input value
//   };

//   const handleAddOperator = () => {
//     if (operatorName.trim() !== '') { // Make sure input is not empty
//       setOperators([...operators, operatorName]); // Add the new operator to the array
//       setOperatorName(''); // Clear the input field
//     }
//   };

//   return (
//     <div className="operator-list">
//       <h2>Operator List</h2>
//       <div className="input-container">
//         <input
//           type="text"
//           value={operatorName}
//           onChange={handleInputChange}
//           placeholder="Enter operator name"
//         />
//         <button onClick={handleAddOperator}>Add Operator</button>
//         </div>
//       <ul>
//         {operators.map((operator, index) => (
//           <li key={index}>{operator}</li> // Display each operator in the list
//         ))}
//       </ul>

//       <button>Save</button>
//     </div>
//   );
// };

// export default OperatorList;
import React, { useState } from 'react';
import axios from 'axios';
import './operatorList.css'
import { URL } from './URL.js';


const OperatorList = () => {
  const [operatorName, setOperatorName] = useState(''); // For the current input
  const [operators, setOperators] = useState([]); // For the list of operators
  const [error, setError] = useState(''); // To handle any errors
  const [successMessage, setSuccessMessage] = useState(''); // To show success messages

  const handleInputChange = (e) => {
    setOperatorName(e.target.value); // Update the operatorName state with the input value
  };

  const handleAddOperator = () => {
    if (operatorName.trim() !== '') { // Make sure input is not empty
      // Send the operatorName to the backend
      axios.post(`${URL}/add_operator`, { name: operatorName , userID: localStorage.getItem("ID") })
        .then(response => {
          // If successfully added, update the UI
          setOperators([...operators, operatorName]); // Add the new operator to the list
          setOperatorName(''); // Clear the input field
          setSuccessMessage('Operator added successfully'); // Show success message
          setError(''); // Clear any errors
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

  return (
    <div className="operator-list">
      <h2>Operator List</h2>
      <div className="input-container">
        <input
          type="text"
          value={operatorName}
          onChange={handleInputChange}
          placeholder="Enter operator name"
        />
        <button onClick={handleAddOperator}>Add Operator</button>
      </div>

      {error && <p className="error-message">{error}</p>} {/* Display error messages */}
      {successMessage && <p className="success-message">{successMessage}</p>} {/* Display success messages */}

      <ul>
        {operators.map((operator, index) => (
          <li key={index}>{operator}</li> // Display each operator in the list
        ))}
      </ul>

      <button>Save</button>
    </div>
  );
};

export default OperatorList;
