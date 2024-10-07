import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './BarChartPlaceholder.css';

const BarChartPlaceholder = ({ shiftwiseData }) => {
  // If no data is available, show a message
 
  // Prepare the data for the bar chart
  const preparedData = shiftwiseData.map(device => {
    let totalRunningTime = 0;
    let totalBreakdownTime = 0;
    let totalShiftTime = 0;

    // Loop over all channels in the device
    Object.keys(device).filter(key => key.startsWith('ch')).forEach(channelKey => {
      const channel = device[channelKey];

      // Aggregate data from each shift (morning, evening, night)
      ['morning', 'evening', 'night'].forEach(shift => {
        const shiftData = channel[shift];
        if (shiftData) {
          // Parse shift time safely, assuming default values if data is missing or malformed
          const shiftTimeInHours = typeof shiftData.shift_time === 'string' 
            ? parseInt(shiftData.shift_time.split(':')[0], 10) || 0 
            : shiftData.shift_time / 60;

          totalShiftTime += shiftTimeInHours;
          totalRunningTime += shiftData.run_time || 0;
          totalBreakdownTime += shiftTimeInHours - (shiftData.run_time || 0);
        }
      });
    });

    return {
      name: `Device ${device.deviceno}`,
      running: totalRunningTime,
      breakdown: totalBreakdownTime,
      total: totalShiftTime,
    };
  });

  return (
    <div className="bar-chart-placeholder">
      <h3>Machine Shift Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={preparedData}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="running" stackId="a" fill="#82ca9d" />
          <Bar dataKey="breakdown" stackId="a" fill="#8884d8" />
          <Bar dataKey="total" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartPlaceholder;
