
// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import dayjs from 'dayjs'; // For date manipulation
// // import duration from 'dayjs/plugin/duration'; // For calculating time differences
// // import customParseFormat from 'dayjs/plugin/customParseFormat'; // To handle custom date formats
// // import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
// // import 'react-circular-progressbar/dist/styles.css';
// // import { URL } from './URL';

// // dayjs.extend(duration);
// // dayjs.extend(customParseFormat);

// // const ReasonsStoppage = () => {
// //   const [data, setData] = useState([]);
// //   const [filteredData, setFilteredData] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [filterDate, setFilterDate] = useState('');
// //   const [minTimeDifference, setMinTimeDifference] = useState(0); // To filter time differences
// //   const [filterType, setFilterType] = useState('greater'); // 'greater' or 'less'
// //   const [reasonPercentages, setReasonPercentages] = useState({}); // Store percentages for all reasons

// //   // Fetch data from the API
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const response = await axios.get(`${URL}/get_save_off_reasons`);
// //         console.log("Response data:", response.data.data); // Log the actual data for debugging
// //         setData(response.data.data); // Set the raw data
// //         setFilteredData(response.data.data); // Initialize filteredData with all data
// //         setLoading(false);
// //       } catch (err) {
// //         console.error('Error fetching data:', err);
// //         setError('Error fetching data');
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   // Helper function to calculate the time difference in minutes
// //   const calculateTimeDifference = (startDate, startTime, endDate, endTime) => {
// //     if (!startDate || !startTime || !endTime) return null;

// //     let effectiveEndDate = endDate || startDate;
// //     const parsedStartDate = dayjs(startDate, 'D/M/YY');
// //     const parsedEndDate = dayjs(effectiveEndDate, 'D/M/YY');

// //     if (parsedEndDate.isBefore(parsedStartDate)) {
// //       effectiveEndDate = parsedStartDate.add(1, 'day').format('D/M/YY');
// //     }

// //     const startDateTimeStr = `${startDate} ${startTime}`;
// //     const endDateTimeStr = `${effectiveEndDate} ${endTime}`;
// //     const format = 'D/M/YY H:m:s';
// //     const start = dayjs(startDateTimeStr, format);
// //     const end = dayjs(endDateTimeStr, format);

// //     if (start.isValid() && end.isValid()) {
// //       return dayjs.duration(end.diff(start)).asMinutes();
// //     }

// //     return null;
// //   };

// //   // Function to filter data and calculate the percentage for each reason
// //   const filterData = () => {
// //     let temp = data;

// //     if (filterDate) {
// //       const parsedDate = dayjs(filterDate).format('D/M/YY');
// //       temp = temp.filter(item => item.date === parsedDate);
// //     }

// //     if (minTimeDifference > 0) {
// //       temp = temp.filter(item => {
// //         if (item.endTime) {
// //           const diff = calculateTimeDifference(item.date, item.time, item.endDate, item.endTime);
// //           if (diff === null) return false;

// //           if (filterType === 'greater') {
// //             return diff >= minTimeDifference;
// //           } else if (filterType === 'less') {
// //             return diff <= minTimeDifference;
// //           }
// //         }
// //         return false;
// //       });
// //     }

// //     setFilteredData(temp);
// //     calculateReasonPercentages(temp);
// //   };

// //   // Calculate percentage of time difference for each reason
// //   const calculateReasonPercentages = (filtered) => {
// //     const reasonTimeDiff = {};
// //     const reasonCount = {};

// //     filtered.forEach(item => {
// //       if (item.reason && item.endTime) {
// //         const timeDifference = calculateTimeDifference(item.date, item.time, item.endDate, item.endTime);
// //         if (timeDifference !== null) {
// //           if (!reasonTimeDiff[item.reason]) {
// //             reasonTimeDiff[item.reason] = 0;
// //             reasonCount[item.reason] = 0;
// //           }
// //           reasonTimeDiff[item.reason] += timeDifference;
// //           reasonCount[item.reason]++;
// //         }
// //       }
// //     });

// //     const percentages = {};
// //     Object.keys(reasonTimeDiff).forEach(reason => {
// //       percentages[reason] = (reasonTimeDiff[reason] / filtered.length) * 100;
// //     });

// //     setReasonPercentages(percentages);
// //   };

// //   // Handle changes in the date filter input
// //   const handleDateChange = (e) => {
// //     setFilterDate(e.target.value);
// //   };

// //   // Handle changes in the time difference filter input
// //   const handleTimeDifferenceChange = (e) => {
// //     const value = parseInt(e.target.value, 10);
// //     setMinTimeDifference(isNaN(value) ? 0 : value);
// //   };

// //   // Handle changes in the filter type selection
// //   const handleFilterTypeChange = (e) => {
// //     setFilterType(e.target.value);
// //   };

// //   // Apply filters whenever filterDate, minTimeDifference, filterType, or data changes
// //   useEffect(() => {
// //     filterData();
// //   }, [filterDate, minTimeDifference, filterType, data]);

// //   // Rendering Logic
// //   if (loading) {
// //     return <div>Loading data...</div>;
// //   }

// //   if (error) {
// //     return <div style={{ color: 'red' }}>{error}</div>;
// //   }

// //   return (
// //     <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
// //       <h2>Device OFF Status Data</h2>

// //       {/* Filters Section */}
// //       <div style={{ marginBottom: '20px' }}>
// //         <div style={{ marginBottom: '10px' }}>
// //           <label htmlFor="dateFilter" style={{ marginRight: '10px' }}>Filter by Date:</label>
// //           <input
// //             type="date"
// //             id="dateFilter"
// //             value={filterDate}
// //             onChange={handleDateChange}
// //             style={{ padding: '5px' }}
// //           />
// //         </div>

// //         {/* Time Difference Filter */}
// //         <div style={{ marginBottom: '10px' }}>
// //           <label htmlFor="filterType" style={{ marginRight: '10px' }}>
// //             Time Difference Filter:
// //           </label>
// //           <select
// //             id="filterType"
// //             value={filterType}
// //             onChange={handleFilterTypeChange}
// //             style={{ padding: '5px', marginRight: '10px' }}
// //           >
// //             <option value="greater">Greater than or equal to</option>
// //             <option value="less">Less than or equal to</option>
// //           </select>

// //           <label htmlFor="timeDifferenceFilter" style={{ marginRight: '10px' }}>
// //             Minutes:
// //           </label>
// //           <input
// //             type="number"
// //             id="timeDifferenceFilter"
// //             value={minTimeDifference}
// //             onChange={handleTimeDifferenceChange}
// //             min="0"
// //             style={{ padding: '5px', width: '100px' }}
// //           />
// //         </div>
// //       </div>

// //       {/* Circular Progress Bars for each reason */}
// //       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '120px', marginBottom: '20px' }}>
// //         {Object.keys(reasonPercentages).map((reason) => (
// //           <div key={reason} style={{ width: '100px', textAlign: 'center' }}>
// //             <CircularProgressbar
// //               value={reasonPercentages[reason]}
// //               text={`${reasonPercentages[reason].toFixed(2)}%`}
// //               styles={buildStyles({
// //                 pathColor: `#3e98c7`,
// //                 textColor: '#000',
// //               })}
// //             />
// //             <p style={{ marginTop: '10px' }}>{reason}</p>
// //             <p> PERCENTAGE: {reasonPercentages[reason].toFixed(2)}</p>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Data Table */}
// //       <table
// //         style={{
// //           width: '100%',
// //           borderCollapse: 'collapse',
// //         }}
// //       >
// //         <thead>
// //           <tr>
// //             <th style={tableHeaderStyle}>Device No</th>
// //             <th style={tableHeaderStyle}>Channel</th>
// //             <th style={tableHeaderStyle}>Date</th>
// //             <th style={tableHeaderStyle}>Time</th>
// //             <th style={tableHeaderStyle}>End Time</th>
// //             <th style={tableHeaderStyle}>End Date</th>
// //             <th style={tableHeaderStyle}>Status</th>
// //             <th style={tableHeaderStyle}>Shift</th>
// //             <th style={tableHeaderStyle}>Time Difference (minutes)</th>
// //             <th style={tableHeaderStyle}>Reason</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {filteredData.length > 0 ? (
// //             filteredData.map((item) => {
// //               const timeDifference = item.endTime
// //                 ? calculateTimeDifference(item.date, item.time, item.endDate, item.endTime)
// //                 : null;

// //               return (
// //                 <tr key={item._id}>
// //                   <td style={tableCellStyle}>{item.deviceNo}</td>
// //                   <td style={tableCellStyle}>{item.channel}</td>
// //                   <td style={tableCellStyle}>{item.date}</td>
// //                   <td style={tableCellStyle}>{item.time}</td>
// //                   <td style={tableCellStyle}>{item.endTime || 'N/A'}</td>
// //                   <td style={tableCellStyle}>{item.endDate || 'N/A'}</td>
// //                   <td style={tableCellStyle}>{item.status}</td>
// //                   <td style={tableCellStyle}>{item.shift}</td>
// //                   <td style={tableCellStyle}>
// //                     {timeDifference !== null ? timeDifference.toFixed(2) : 'Running'}
// //                   </td>
// //                   <td style={tableCellStyle}>{item.reason || 'N/A'}</td>
// //                 </tr>
// //               );
// //             })
// //           ) : (
// //             <tr>
// //               <td colSpan="10" style={{ textAlign: 'center', padding: '10px' }}>
// //                 No Data Found
// //               </td>
// //             </tr>
// //           )}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // // Styles for table headers and cells
// // const tableHeaderStyle = {
// //   border: '1px solid #ddd',
// //   padding: '8px',
// //   backgroundColor: '#f2f2f2',
// //   textAlign: 'left',
// // };

// // const tableCellStyle = {
// //   border: '1px solid #ddd',
// //   padding: '8px',
// //   textAlign: 'left',
// // };

// // export default ReasonsStoppage;
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import dayjs from 'dayjs'; // For date manipulation
// import duration from 'dayjs/plugin/duration'; // For calculating time differences
// import customParseFormat from 'dayjs/plugin/customParseFormat'; // To handle custom date formats
// import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';
// import { URL } from './URL';

// dayjs.extend(duration);
// dayjs.extend(customParseFormat);

// const ReasonsStoppage = () => {
//   const [data, setData] = useState([]);
//   const [groupedData, setGroupedData] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filterDate, setFilterDate] = useState('');
//   const [minTimeDifference, setMinTimeDifference] = useState(0); // To filter time differences
//   const [filterType, setFilterType] = useState('greater'); // 'greater' or 'less'
//   const [reasonPercentages, setReasonPercentages] = useState({}); // Store percentages for all reasons

//   // Fetch data from the API
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${URL}/get_save_off_reasons`);
//         console.log("Response data:", response.data.data); // Log the actual data for debugging
//         setData(response.data.data); // Set the raw data
//         let re = groupDataByDate(response.data.data); // Group data by date
//         console.log("group by date ", re);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError('Error fetching data');
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Helper function to calculate the time difference in minutes
//   const calculateTimeDifference = (startDate, startTime, endDate, endTime) => {
//     if (!startDate || !startTime || !endTime) return null;

//     let effectiveEndDate = endDate || startDate;
//     const parsedStartDate = dayjs(startDate, 'D/M/YY');
//     const parsedEndDate = dayjs(effectiveEndDate, 'D/M/YY');

//     if (parsedEndDate.isBefore(parsedStartDate)) {
//       effectiveEndDate = parsedStartDate.add(1, 'day').format('D/M/YY');
//     }

//     const startDateTimeStr = `${startDate} ${startTime}`;
//     const endDateTimeStr = `${effectiveEndDate} ${endTime}`;
//     const format = 'D/M/YY H:m:s';
//     const start = dayjs(startDateTimeStr, format);
//     const end = dayjs(endDateTimeStr, format);

//     if (start.isValid() && end.isValid()) {
//       return dayjs.duration(end.diff(start)).asMinutes();
//     }

//     return null;
//   };

//   // Group data by date
//   const groupDataByDate = (data) => {
//     const grouped = data.reduce((acc, item) => {
//       if (!acc[item.date]) {
//         acc[item.date] = [];
//       }
//       acc[item.date].push(item);
//       return acc;
//     }, {});
//     setGroupedData(grouped);
//   };

//   // Handle changes in the date filter input
//   const handleDateChange = (e) => {
//     setFilterDate(e.target.value);
//   };

//   // Handle changes in the time difference filter input
//   const handleTimeDifferenceChange = (e) => {
//     const value = parseInt(e.target.value, 10);
//     setMinTimeDifference(isNaN(value) ? 0 : value);
//   };

//   // Handle changes in the filter type selection
//   const handleFilterTypeChange = (e) => {
//     setFilterType(e.target.value);
//   };

//   // Rendering Logic
//   if (loading) {
//     return <div>Loading data...</div>;
//   }

//   if (error) {
//     return <div style={{ color: 'red' }}>{error}</div>;
//   }

//   return (
//     <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//       <h2>Device OFF Status Data</h2>

//       {/* Filters Section */}
//       <div style={{ marginBottom: '20px' }}>
//         <div style={{ marginBottom: '10px' }}>
//           <label htmlFor="dateFilter" style={{ marginRight: '10px' }}>Filter by Date:</label>
//           <input
//             type="date"
//             id="dateFilter"
//             value={filterDate}
//             onChange={handleDateChange}
//             style={{ padding: '5px' }}
//           />
//         </div>

//         {/* Time Difference Filter */}
//         <div style={{ marginBottom: '10px' }}>
//           <label htmlFor="filterType" style={{ marginRight: '10px' }}>
//             Time Difference Filter:
//           </label>
//           <select
//             id="filterType"
//             value={filterType}
//             onChange={handleFilterTypeChange}
//             style={{ padding: '5px', marginRight: '10px' }}
//           >
//             <option value="greater">Greater than or equal to</option>
//             <option value="less">Less than or equal to</option>
//           </select>

//           <label htmlFor="timeDifferenceFilter" style={{ marginRight: '10px' }}>
//             Minutes:
//           </label>
//           <input
//             type="number"
//             id="timeDifferenceFilter"
//             value={minTimeDifference}
//             onChange={handleTimeDifferenceChange}
//             min="0"
//             style={{ padding: '5px', width: '100px' }}
//           />
//         </div>
//       </div>

//       {/* Render a table for each group of data (grouped by date) */}
//       {Object.keys(groupedData).map((date) => (
//         <div key={date} style={{ marginBottom: '40px' }}>
//           <h3 style={{ marginBottom: '10px' }}>Data for {dayjs(date).format('YY/M/D')}</h3>
//           <table
//             style={{
//               width: '100%',
//               borderCollapse: 'collapse',
//             }}
//           >
//             <thead>
//               <tr>
//                 <th style={tableHeaderStyle}>Device No</th>
//                 <th style={tableHeaderStyle}>Channel</th>
//                 <th style={tableHeaderStyle}>Date</th>
//                 <th style={tableHeaderStyle}>Time</th>
//                 <th style={tableHeaderStyle}>End Time</th>
//                 <th style={tableHeaderStyle}>End Date</th>
//                 <th style={tableHeaderStyle}>Status</th>
//                 <th style={tableHeaderStyle}>Shift</th>
//                 <th style={tableHeaderStyle}>Time Difference (minutes)</th>
//                 <th style={tableHeaderStyle}>Reason</th>
//               </tr>
//             </thead>
//             <tbody>
//               {groupedData[date].map((item) => {
//                 const timeDifference = item.endTime
//                   ? calculateTimeDifference(item.date, item.time, item.endDate, item.endTime)
//                   : null;

//                 return (
//                   <tr key={item._id}>
//                     <td style={tableCellStyle}>{item.deviceNo}</td>
//                     <td style={tableCellStyle}>{item.channel}</td>
//                     <td style={tableCellStyle}>{item.date}</td>
//                     <td style={tableCellStyle}>{item.time}</td>
//                     <td style={tableCellStyle}>{item.endTime || 'N/A'}</td>
//                     <td style={tableCellStyle}>{item.endDate || 'N/A'}</td>
//                     <td style={tableCellStyle}>{item.status}</td>
//                     <td style={tableCellStyle}>{item.shift}</td>
//                     <td style={tableCellStyle}>
//                       {timeDifference !== null ? timeDifference.toFixed(2) : 'Running'}
//                     </td>
//                     <td style={tableCellStyle}>{item.reason || 'N/A'}</td>
//                   </tr>
//                 );
//               })}
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
//   textAlign: 'left',
// };

// const tableCellStyle = {
//   border: '1px solid #ddd',
//   padding: '8px',
//   textAlign: 'left',
// };

// export default ReasonsStoppage;
import React, { useState, useEffect } from 'react';
import './MWReport.css';
import BarChartPlaceholder from '../Components/BarChartPlaceholder';
import axios from 'axios'; // Axios for fetching data
import CircularProgress from '../Components/Progress';
import dayjs from 'dayjs'; // For handling date logic
import isBetween from 'dayjs/plugin/isBetween'; // Import isBetween plugin

dayjs.extend(isBetween); // Extend dayjs with isBetween plugin

const ReasonsStoppage = () => {
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
        const response = await axios.get('https://dashboard-fiverr-nodejs.vercel.app/breakwise_data');
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
      console.log("Start filtering data by date range and shift:", { startDate, endDate, selectedShift });

      const formattedStartDate = dayjs(startDate, 'YYYY-MM-DD');
      const formattedEndDate = dayjs(endDate, 'YYYY-MM-DD');

      console.log("Formatted Start Date:", formattedStartDate.format('YYYY-MM-DD'));
      console.log("Formatted End Date:", formattedEndDate.format('YYYY-MM-DD'));

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
    console.log('Changing filter to:', filter); // CLG 5
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
    console.log('Setting custom date range:', { start, end }); // CLG 7
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
    <h1>Stoppage Wise Report</h1>

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
                      console.log("channel key", device)
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

export default ReasonsStoppage;
