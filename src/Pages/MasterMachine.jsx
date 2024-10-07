import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from './URL';
import './MasterMachine.css';  // Import the CSS file

function MasterMachine() {
  const [data, setData] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    // Fetch data from an API endpoint
    axios.get(`${URL}/shiftwise`)  // Adjust to your API endpoint
      .then(response => {
        setData(response.data.message);  // Adjusted to use response.data.message
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <h1>Device Data</h1>
      <div className="device-data-list">
        {data.map((item, index) => (
          <div key={index} className="device-data-item">
            <h2>Device Data Record {index + 1}</h2>
            <p><strong>Date:</strong> {item._id.date}</p>
            <p><strong>Device Number:</strong> {item._id.deviceno}</p>

            {/* Render all keys dynamically */}
            {Object.keys(item).map((key) => {
              if (typeof item[key] !== 'object') {
                return (
                  <p key={key}>
                    <strong>{key.replace(/_/g, ' ')}:</strong> {item[key] !== null ? item[key] : 'N/A'}
                  </p>
                );
              }
              return null;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MasterMachine;