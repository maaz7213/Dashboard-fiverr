import React from 'react';
import './DataModal.css'; // Import the CSS file

const DataModal = ({ showModal, onClose, data }) => {
  if (!showModal || !data) return null; // Ensure modal is only shown when needed

  const { run_time, shift_time, average, average_threshold, percentages } = data;
  const [runPercentage, averagePercentage] = percentages;

  return (
    <div className="overlay">
      <div className="modal">
        <h2>Shift Data</h2>

        {/* Close Button */}
        <button className="closeButton" onClick={onClose} aria-label="Close Modal">
          &times;
        </button>

        {/* Display Shift Data */}
        <div className="content-modal">
          <div className="dataSection">
            <p><strong>Shift Time:</strong> {shift_time} minutes ({(shift_time / 60).toFixed(2)} hours)</p>
            <p><strong>Run Time:</strong> {run_time} minutes ({runPercentage.toFixed(2)}%)</p>
            <p><strong>Average:</strong> {average} ({averagePercentage.toFixed(2)}%)</p>
            <p><strong>Average Threshold:</strong> {average_threshold}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataModal;
