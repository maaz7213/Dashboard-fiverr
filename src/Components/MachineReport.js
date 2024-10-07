import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import './MachineReport.css';
import 'react-circular-progressbar/dist/styles.css';

const MachineReport = ({ date, shift, machines }) => {
  
  // Function to determine color based on percentage
  const getColor = (percentage) => {
    if (percentage < 50) return '#f94144';  // Red for < 50%
    if (percentage < 75) return '#f8961e';  // Orange for 50-74%
    return '#43aa8b';                       // Green for 75% and above
  };

  return (
    <div className="report-section">
      <div className="report-header">
        <span>{date} {shift}</span>
      </div>
      <div className="machine-row">
        {machines.map((percentage, index) => (
          <div className="machine" key={index}>
            <h3>Mach {index + 1}</h3>
            <CircularProgressbar 
              value={percentage} 
              text={`${percentage}%`} 
              styles={buildStyles({
                pathColor: getColor(percentage),  // Change color based on percentage
                textColor: getColor(percentage),  // Change text color based on percentage
                trailColor: '#d6d6d6',            // Optional: background trail color
              })}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MachineReport;
