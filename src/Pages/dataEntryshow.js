

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { URL } from './URL.js';

// const DataEntryshow = () => {
//   const [data, setData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [operators, setOperators] = useState([]);
//   const [operatorFilter, setOperatorFilter] = useState('');
//   const [shiftFilter, setShiftFilter] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState();

//   // Fetch data from the API
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${URL}/get_operator_selections`);
//         const selections = response.data.data;

//         // Fetch operators to get operator names
//         const operatorsResponse = await axios.get(
//           `${URL}/get_operators_by_userid/${localStorage.getItem('ID')}`
//         );
//         const operatorsData = operatorsResponse.data.operators;

//         // Map operator IDs to names
//         const operatorsMap = {};
//         operatorsData.forEach((operator) => {
//           operatorsMap[operator._id] = operator.name;
//         });

//         // Attach operator names to the data or use operatorId directly if no name is found
//         const dataWithOperatorNames = selections.map((item) => ({
//           ...item,
//           operatorName: operatorsMap[item.operatorId] || item.operatorId || 'Unknown',
//         }));

//         setData(dataWithOperatorNames);
//         setFilteredData(dataWithOperatorNames);
//         setOperators(operatorsData);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError('Error fetching data');
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Handle operator filter change
//   const handleOperatorFilterChange = (e) => {
//     setOperatorFilter(e.target.value);
//   };

//   // Handle shift filter change
//   const handleShiftFilterChange = (e) => {
//     setShiftFilter(e.target.value);
//   };

//   // Apply filters
//   const applyFilters = () => {
//     let filtered = data;

//     if (operatorFilter) {
//       filtered = filtered.filter(
//         (item) => item.operatorName === operatorFilter
//       );
//     }

//     if (shiftFilter) {
//       filtered = filtered.filter((item) =>
//         item.shift.toLowerCase().includes(shiftFilter.toLowerCase())
//       );
//     }

//     setFilteredData(filtered);
//   };

//   // Reset filters
//   const resetFilters = () => {
//     setOperatorFilter('');
//     setShiftFilter('');
//     setFilteredData(data);
//   };

//   // Group data by date
//   const groupDataByDate = (data) => {
//     return data.reduce((acc, item) => {
//       if (!acc[item.date]) {
//         acc[item.date] = [];
//       }
//       acc[item.date].push(item);
//       return acc;
//     }, {});
//   };

//   const groupedData = groupDataByDate(filteredData);

//   if (loading) {
//     return <div>Loading data...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   // Get unique operator names for the dropdown
//   const operatorNames = [...new Set(data.map((item) => item.operatorName))];

//   return (
//     <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//       <h2>Operator Selections</h2>

//       {/* Filter Form */}
//       <div style={{ marginBottom: '20px' }}>
//         <label htmlFor="operatorFilter" style={{ marginRight: '10px' }}>
//           Operator Name:
//         </label>
//         <select
//           id="operatorFilter"
//           value={operatorFilter}
//           onChange={handleOperatorFilterChange}
//           style={{ marginRight: '20px', padding: '5px' }}
//         >
//           <option value="">All Operators</option>
//           {operatorNames.map((name) => (
//             <option key={name} value={name}>
//               {name}
//             </option>
//           ))}
//         </select>

//         <label htmlFor="shiftFilter" style={{ marginRight: '10px' }}>
//           Shift:
//         </label>
//         <input
//           type="text"
//           id="shiftFilter"
//           value={shiftFilter}
//           onChange={handleShiftFilterChange}
//           placeholder="Enter shift"
//           style={{ marginRight: '20px', padding: '5px' }}
//         />

//         <button onClick={applyFilters} style={{ marginRight: '10px' }}>
//           Apply Filters
//         </button>
//         <button onClick={resetFilters}>Reset Filters</button>
//       </div>

//       {/* Render tables grouped by date */}
//       {Object.keys(groupedData).map((date) => (
//         <div key={date} style={{ marginBottom: '40px' }}>
//           <h3>Data for {date}</h3>
//           <table
//             style={{
//               width: '100%',
//               borderCollapse: 'collapse',
//               marginTop: '10px',
//             }}
//           >
//             <thead>
//               <tr>
//                 <th style={tableHeaderStyle}>Device No</th>
//                 <th style={tableHeaderStyle}>Channel</th>
//                 <th style={tableHeaderStyle}>Machine</th>
//                 <th style={tableHeaderStyle}>Date</th>
//                 <th style={tableHeaderStyle}>Shift</th>
//                 <th style={tableHeaderStyle}>Operator Name</th>
//               </tr>
//             </thead>
//             <tbody>
//               {groupedData[date].map((item) => (
//                 <tr key={item._id}>
//                   <td style={tableCellStyle}>{item.deviceno}</td>
//                   <td style={tableCellStyle}>{item.channel}</td>
//                   <td style={tableCellStyle}>MACH {item.channel}</td>
//                   <td style={tableCellStyle}>{item.date}</td>
//                   <td style={tableCellStyle}>{item.shift}</td>
//                   <td style={tableCellStyle}>{item.operatorName}</td>
//                 </tr>
//               ))}
//               {groupedData[date].length === 0 && (
//                 <tr>
//                   <td colSpan="8" style={{ textAlign: 'center' }}>
//                     No Data Found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       ))}
//     </div>
//   );
// };

// // Styles for table headers and cells
// const tableHeaderStyle = {
//   border: '1px solid #ddd',
//   padding: '8px',
//   backgroundColor: '#f2f2f2',
// };

// const tableCellStyle = {
//   border: '1px solid #ddd',
//   padding: '8px',
// };

// export default DataEntryshow;

import React, { useState, useEffect } from 'react';
import './MWReport.css';
import BarChartPlaceholder from '../Components/BarChartPlaceholder';
import axios from 'axios'; // Axios for fetching data
import CircularProgress from '../Components/Progress';
import dayjs from 'dayjs'; // For handling date logic
import isBetween from 'dayjs/plugin/isBetween'; // Import isBetween plugin

dayjs.extend(isBetween); // Extend dayjs with isBetween plugin

const DataEntryshow = () => {
  const [reportData, setReportData] = useState([]); // Report data fetched from API
  const [filteredData, setFilteredData] = useState([]); // Filtered data based on date range
  const [selectedFilter, setSelectedFilter] = useState('Day'); // Default filter is 'Day'
  const [selectedShift, setSelectedShift] = useState('all'); // Default shift filter
  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day').format('YYYY-MM-DD')); // Start date (default 1 week back)
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD')); // End date (current date by default)
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await axios.get('https://dashboard-fiverr-nodejs.vercel.app/shiftwise');
        const response = await axios.get('https://dashboard-fiverr-nodejs.vercel.app/operatorwise_data');
        console.log('API Response:', response.data); // CLG 2
        setReportData(response.data.data); // Set report data from the response
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err); // CLG 3
        setError('Failed to fetch data.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);




  useEffect(() => {
    if (reportData.length > 0) {
      // console.log("Start filtering data by date range and shift:", { startDate, endDate, selectedShift });

      const formattedStartDate = dayjs(startDate, 'YYYY-MM-DD');
      const formattedEndDate = dayjs(endDate, 'YYYY-MM-DD');

   


      const filtered = reportData.map((report) => {
        const [year, month, day] = report.currentdate.split('/');
        const fullYear = year.length === 2 ? `20${year}` : year;
        const reportDate = dayjs(`${fullYear}-${month}-${day}`, 'YYYY-MM-DD');
      
        if (!reportDate.isValid()) {
          console.log("Invalid report date:", reportDate);
          return null;
        }
      
        // Check if the date is within the specified range
        const isWithinRange = reportDate.isBetween(formattedStartDate, formattedEndDate, 'day', '[]');
        if (!isWithinRange) return null;
      
        // Initialize filteredChannels for this report based on selected shift
        const filteredChannels = {};
      
        // Filter channels based on selected shift
        Object.keys(report).forEach((channelKey) => {
          if (channelKey.startsWith('ch')) {
            const shiftData = report[channelKey];
            
            // Check if the selected shift exists in the shiftData
            if (shiftData[selectedShift]) {
              filteredChannels[channelKey] = {
                [selectedShift]: shiftData[selectedShift],
                channel_name: shiftData.channel_name, // Retain the channel name if needed
              };
            }else if (selectedShift === 'all') {
              filteredChannels[channelKey] = {
                ...shiftData, // Include all shifts (morning, evening, night if present)
                channel_name: shiftData.channel_name,
              };
            
            // Case 3: Selected shift does not exist and is not "all" - optionally handle missing shift
            }else {
              // Optional: If shift data for the selectedShift is missing, add a default or leave empty
              console.log(`Shift data for ${selectedShift} not found in ${channelKey}`);
            }
          }
        });
      
        // Return the filtered channels if any valid data exists
        return Object.keys(filteredChannels).length > 0 ? { ...report, ...filteredChannels } : null;
      }).filter(Boolean);
      
      // Set the filtered result to state
      setFilteredData(filtered);
    }
  }, [reportData, startDate, endDate, selectedShift]);



  // Handle filter changes for time period
  const handleFilterChange = (filter) => {
    
    setSelectedFilter(filter);

    // Adjust date range based on selected filter
    if (filter === 'Day') {
      setStartDate(dayjs().format('YY-MM-DD'));
      setEndDate(dayjs().format('YY-MM-DD'));
    } else if (filter === 'Week') {
      setStartDate(dayjs().subtract(7, 'day').format('YY-MM-DD'));
      setEndDate(dayjs().format('YY-MM-DD'));
    } else if (filter === 'Month') {
      setStartDate(dayjs().subtract(30, 'day').format('YY-MM-DD'));
      setEndDate(dayjs().format('YY-MM-DD'));
    }
  };

  // Handle shift changes
  const handleShiftChange = (shift) => {
    console.log('Changing shift to:', shift); // CLG 6
    setSelectedShift(shift);
  };

  // Handle custom date range input
  const handleDateRangeChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    setSelectedFilter('Range'); // Apply custom range filter
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // const dataToDisplay = filterReportData();

  // console.log('Data to display:', dataToDisplay); // CLG 8

  return (
    <div className="container">
    <h1>Operator Wise Report</h1>

    {/* Search bar and time filter buttons */}
    <div className="search-bar">
      <input type="text" placeholder="Search" />
      <div className="time-filters">
        <button
          className={selectedFilter === 'Day' ? 'active' : ''}
          onClick={() => handleFilterChange('Day')}
        >
          Day
        </button>
        <button
          className={selectedFilter === 'Shift' ? 'active' : ''}
          onClick={() => handleFilterChange('Shift')}
        >
          Shift
        </button>
        <button
          className={selectedFilter === 'Week' ? 'active' : ''}
          onClick={() => handleFilterChange('Week')}
        >
          Week
        </button>
        <button
          className={selectedFilter === 'Month' ? 'active' : ''}
          onClick={() => handleFilterChange('Month')}
        >
          Month
        </button>
        <div className="date-range">
          <label>Custom Range:</label>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleDateRangeChange(e.target.value, endDate)}
          />
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleDateRangeChange(startDate, e.target.value)}
          />
        </div>
      </div>
    </div>

    {/* Shift selection visible only when 'Shift' filter is selected */}
    {selectedFilter === 'Shift' && (
      <div className="shift-filters">
        <button
          className={selectedShift === 'all' ? 'active' : ''}
          onClick={() => handleShiftChange('all')}
        >
          All Shifts
        </button>
        <button
          className={selectedShift === 'morning' ? 'active' : ''}
          onClick={() => handleShiftChange('morning')}
        >
          Morning
        </button>
        <button
          className={selectedShift === 'night' ? 'active' : ''}
          onClick={() => handleShiftChange('night')}
        >
          Night
        </button>
      </div>
    )}

    {/* Bar Chart Section */}
    <div className="bar-chart-section">
      {filteredData && filteredData.length > 0 ? (
        <BarChartPlaceholder shiftwiseData={filteredData} />
      ) : (
        <p>No shift data available</p>
      )}
    </div>

    {/* Progress Section */}
    <div className="progress-section">
    {/* Grouping filteredData by currentdate */}
    {filteredData &&
      Object.entries(
        filteredData.reduce((acc, device) => {
          const deviceDate = device.currentdate;
          if (!acc[deviceDate]) {
            acc[deviceDate] = [];
          }
          acc[deviceDate].push(device);
          return acc;
        }, {})
      ).map(([deviceDate, devices]) => (
        <div key={deviceDate} className="date-section">
          <h2>Date: {deviceDate}</h2>
          {devices.map((device, deviceIndex) => (
            <div key={deviceIndex} className="device-section">
              <h2>Device {device.deviceno}</h2>
              {/* Iterate over each channel */}
              {Object.keys(device)
                .filter((key) => key.startsWith('ch'))
                .map((channelKey) => (
                  <div key={channelKey} className="channel-section">
                    <h3>{device[channelKey].channel_name||channelKey.toUpperCase()}</h3>
                    {['morning', 'evening', 'night'].map((shift) => {
                      const shiftData = device[channelKey][shift];
                      if (!shiftData) return null;

                      // Convert HH:mm:ss to seconds if valid, otherwise return 0
                    
                      const convertTimeToMinutes = (timeStr) => {
                        if (typeof timeStr === 'string' && timeStr.includes(':')) {
                          const [hours, minutes, seconds] = timeStr.split(':').map(Number);
                          return hours * 60 + minutes + (seconds ? seconds / 60 : 0); // Convert seconds to minutes
                        }
                        return 0; // Default to 0 if timeStr is not a valid format
                      };
  
                      // Convert shift_time and run_time to seconds

                      // Convert shift_time and run_time to minutes
                      const shiftTimeInMinutes = convertTimeToMinutes(shiftData.shift_time);
                      const runTimeInMinutes = convertTimeToMinutes(shiftData.run_time);

                      // Calculate runPercentage
                      
                      const runPercentage = shiftTimeInMinutes > 0
                        ? (shiftData.run_time / shiftTimeInMinutes) * 100
                        : 0;

                      const averagePercentage = (shiftData.average / shiftData.average_threshold) * 100 || 0;

                      return (
                        <div key={shift} className="shift-section">
                          <h4>
                            {shift.charAt(0).toUpperCase() + shift.slice(1)} Shift
                          </h4>
                          <CircularProgress
                            size={150}
                            strokeWidth={10}
                            percentages={[runPercentage, averagePercentage]}
                            colors={['#f94144', '#f8961e', '#43aa8b']}
                          />
                          <p>
                          <strong>
                          Shift Duration: 
                          </strong>
                          {shiftTimeInMinutes || 'N/A'}
                          </p>
                          <p>

                          <strong>
                          Run Time: 
                          </strong>
                          {shiftData.run_time || 'N/A'} ({runPercentage.toFixed(2)}%)
                          </p>
                          <p>
                          <strong>
                          Average: 
                          </strong>
                          {shiftData.average || 'N/A'} ({averagePercentage.toFixed(2)}%)
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ))}
            </div>
          ))}
        </div>
      ))}
  </div>


</div>

  );
};

export default DataEntryshow;
