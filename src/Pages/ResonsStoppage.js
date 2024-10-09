
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
//   const [filteredData, setFilteredData] = useState([]);
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
//         setFilteredData(response.data.data); // Initialize filteredData with all data
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

//   // Function to filter data and calculate the percentage for each reason
//   const filterData = () => {
//     let temp = data;

//     if (filterDate) {
//       const parsedDate = dayjs(filterDate).format('D/M/YY');
//       temp = temp.filter(item => item.date === parsedDate);
//     }

//     if (minTimeDifference > 0) {
//       temp = temp.filter(item => {
//         if (item.endTime) {
//           const diff = calculateTimeDifference(item.date, item.time, item.endDate, item.endTime);
//           if (diff === null) return false;

//           if (filterType === 'greater') {
//             return diff >= minTimeDifference;
//           } else if (filterType === 'less') {
//             return diff <= minTimeDifference;
//           }
//         }
//         return false;
//       });
//     }

//     setFilteredData(temp);
//     calculateReasonPercentages(temp);
//   };

//   // Calculate percentage of time difference for each reason
//   const calculateReasonPercentages = (filtered) => {
//     const reasonTimeDiff = {};
//     const reasonCount = {};

//     filtered.forEach(item => {
//       if (item.reason && item.endTime) {
//         const timeDifference = calculateTimeDifference(item.date, item.time, item.endDate, item.endTime);
//         if (timeDifference !== null) {
//           if (!reasonTimeDiff[item.reason]) {
//             reasonTimeDiff[item.reason] = 0;
//             reasonCount[item.reason] = 0;
//           }
//           reasonTimeDiff[item.reason] += timeDifference;
//           reasonCount[item.reason]++;
//         }
//       }
//     });

//     const percentages = {};
//     Object.keys(reasonTimeDiff).forEach(reason => {
//       percentages[reason] = (reasonTimeDiff[reason] / filtered.length) * 100;
//     });

//     setReasonPercentages(percentages);
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

//   // Apply filters whenever filterDate, minTimeDifference, filterType, or data changes
//   useEffect(() => {
//     filterData();
//   }, [filterDate, minTimeDifference, filterType, data]);

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

//       {/* Circular Progress Bars for each reason */}
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '120px', marginBottom: '20px' }}>
//         {Object.keys(reasonPercentages).map((reason) => (
//           <div key={reason} style={{ width: '100px', textAlign: 'center' }}>
//             <CircularProgressbar
//               value={reasonPercentages[reason]}
//               text={`${reasonPercentages[reason].toFixed(2)}%`}
//               styles={buildStyles({
//                 pathColor: `#3e98c7`,
//                 textColor: '#000',
//               })}
//             />
//             <p style={{ marginTop: '10px' }}>{reason}</p>
//             <p> PERCENTAGE: {reasonPercentages[reason].toFixed(2)}</p>
//           </div>
//         ))}
//       </div>

//       {/* Data Table */}
//       <table
//         style={{
//           width: '100%',
//           borderCollapse: 'collapse',
//         }}
//       >
//         <thead>
//           <tr>
//             <th style={tableHeaderStyle}>Device No</th>
//             <th style={tableHeaderStyle}>Channel</th>
//             <th style={tableHeaderStyle}>Date</th>
//             <th style={tableHeaderStyle}>Time</th>
//             <th style={tableHeaderStyle}>End Time</th>
//             <th style={tableHeaderStyle}>End Date</th>
//             <th style={tableHeaderStyle}>Status</th>
//             <th style={tableHeaderStyle}>Shift</th>
//             <th style={tableHeaderStyle}>Time Difference (minutes)</th>
//             <th style={tableHeaderStyle}>Reason</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredData.length > 0 ? (
//             filteredData.map((item) => {
//               const timeDifference = item.endTime
//                 ? calculateTimeDifference(item.date, item.time, item.endDate, item.endTime)
//                 : null;

//               return (
//                 <tr key={item._id}>
//                   <td style={tableCellStyle}>{item.deviceNo}</td>
//                   <td style={tableCellStyle}>{item.channel}</td>
//                   <td style={tableCellStyle}>{item.date}</td>
//                   <td style={tableCellStyle}>{item.time}</td>
//                   <td style={tableCellStyle}>{item.endTime || 'N/A'}</td>
//                   <td style={tableCellStyle}>{item.endDate || 'N/A'}</td>
//                   <td style={tableCellStyle}>{item.status}</td>
//                   <td style={tableCellStyle}>{item.shift}</td>
//                   <td style={tableCellStyle}>
//                     {timeDifference !== null ? timeDifference.toFixed(2) : 'Running'}
//                   </td>
//                   <td style={tableCellStyle}>{item.reason || 'N/A'}</td>
//                 </tr>
//               );
//             })
//           ) : (
//             <tr>
//               <td colSpan="10" style={{ textAlign: 'center', padding: '10px' }}>
//                 No Data Found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
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
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs'; // For date manipulation
import duration from 'dayjs/plugin/duration'; // For calculating time differences
import customParseFormat from 'dayjs/plugin/customParseFormat'; // To handle custom date formats
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { URL } from './URL';

dayjs.extend(duration);
dayjs.extend(customParseFormat);

const ReasonsStoppage = () => {
  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [minTimeDifference, setMinTimeDifference] = useState(0); // To filter time differences
  const [filterType, setFilterType] = useState('greater'); // 'greater' or 'less'
  const [reasonPercentages, setReasonPercentages] = useState({}); // Store percentages for all reasons

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${URL}/get_save_off_reasons`);
        console.log("Response data:", response.data.data); // Log the actual data for debugging
        setData(response.data.data); // Set the raw data
        let re = groupDataByDate(response.data.data); // Group data by date
        console.log("group by date ", re);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to calculate the time difference in minutes
  const calculateTimeDifference = (startDate, startTime, endDate, endTime) => {
    if (!startDate || !startTime || !endTime) return null;

    let effectiveEndDate = endDate || startDate;
    const parsedStartDate = dayjs(startDate, 'D/M/YY');
    const parsedEndDate = dayjs(effectiveEndDate, 'D/M/YY');

    if (parsedEndDate.isBefore(parsedStartDate)) {
      effectiveEndDate = parsedStartDate.add(1, 'day').format('D/M/YY');
    }

    const startDateTimeStr = `${startDate} ${startTime}`;
    const endDateTimeStr = `${effectiveEndDate} ${endTime}`;
    const format = 'D/M/YY H:m:s';
    const start = dayjs(startDateTimeStr, format);
    const end = dayjs(endDateTimeStr, format);

    if (start.isValid() && end.isValid()) {
      return dayjs.duration(end.diff(start)).asMinutes();
    }

    return null;
  };

  // Group data by date
  const groupDataByDate = (data) => {
    const grouped = data.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = [];
      }
      acc[item.date].push(item);
      return acc;
    }, {});
    setGroupedData(grouped);
  };

  // Handle changes in the date filter input
  const handleDateChange = (e) => {
    setFilterDate(e.target.value);
  };

  // Handle changes in the time difference filter input
  const handleTimeDifferenceChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setMinTimeDifference(isNaN(value) ? 0 : value);
  };

  // Handle changes in the filter type selection
  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
  };

  // Rendering Logic
  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Device OFF Status Data</h2>

      {/* Filters Section */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="dateFilter" style={{ marginRight: '10px' }}>Filter by Date:</label>
          <input
            type="date"
            id="dateFilter"
            value={filterDate}
            onChange={handleDateChange}
            style={{ padding: '5px' }}
          />
        </div>

        {/* Time Difference Filter */}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="filterType" style={{ marginRight: '10px' }}>
            Time Difference Filter:
          </label>
          <select
            id="filterType"
            value={filterType}
            onChange={handleFilterTypeChange}
            style={{ padding: '5px', marginRight: '10px' }}
          >
            <option value="greater">Greater than or equal to</option>
            <option value="less">Less than or equal to</option>
          </select>

          <label htmlFor="timeDifferenceFilter" style={{ marginRight: '10px' }}>
            Minutes:
          </label>
          <input
            type="number"
            id="timeDifferenceFilter"
            value={minTimeDifference}
            onChange={handleTimeDifferenceChange}
            min="0"
            style={{ padding: '5px', width: '100px' }}
          />
        </div>
      </div>

      {/* Render a table for each group of data (grouped by date) */}
      {Object.keys(groupedData).map((date) => (
        <div key={date} style={{ marginBottom: '40px' }}>
          <h3 style={{ marginBottom: '10px' }}>Data for {groupedData[date]}</h3>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
            }}
          >
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Device No</th>
                <th style={tableHeaderStyle}>Channel</th>
                <th style={tableHeaderStyle}>Date</th>
                <th style={tableHeaderStyle}>Time</th>
                <th style={tableHeaderStyle}>End Time</th>
                <th style={tableHeaderStyle}>End Date</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Shift</th>
                <th style={tableHeaderStyle}>Time Difference (minutes)</th>
                <th style={tableHeaderStyle}>Reason</th>
              </tr>
            </thead>
            <tbody>
              {groupedData[date].map((item) => {
                const timeDifference = item.endTime
                  ? calculateTimeDifference(item.date, item.time, item.endDate, item.endTime)
                  : null;

                return (
                  <tr key={item._id}>
                    <td style={tableCellStyle}>{item.deviceNo}</td>
                    <td style={tableCellStyle}>{item.channel}</td>
                    <td style={tableCellStyle}>{item.date}</td>
                    <td style={tableCellStyle}>{item.time}</td>
                    <td style={tableCellStyle}>{item.endTime || 'N/A'}</td>
                    <td style={tableCellStyle}>{item.endDate || 'N/A'}</td>
                    <td style={tableCellStyle}>{item.status}</td>
                    <td style={tableCellStyle}>{item.shift}</td>
                    <td style={tableCellStyle}>
                      {timeDifference !== null ? timeDifference.toFixed(2) : 'Running'}
                    </td>
                    <td style={tableCellStyle}>{item.reason || 'N/A'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

// Styles for table headers and cells
const tableHeaderStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  backgroundColor: '#f2f2f2',
  textAlign: 'left',
};

const tableCellStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  textAlign: 'left',
};

export default ReasonsStoppage;
