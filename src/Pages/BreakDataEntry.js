// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { URL } from './URL.js';

// const BreakDataEntry = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [saveStatus, setSaveStatus] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`${URL}/ONOff`);
//         // Filter data to include only items with status 'OFF'
//         console.log("response",response);
//         const offData = response.data.data.filter(item => item.status === 'OFF');
//         setData(offData); // Set the filtered data
//         setLoading(false);
//       } catch (err) {
//         setError('Error fetching data');
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleSave = async () => {
//     try {
//       // Send POST request to save reasons
//       const response = await axios.post(`${URL}/save_off_reasons`, { reasons: data });
//       if (response.status === 200) {
//         setSaveStatus('Reasons saved successfully!');
//       } else {
//         setSaveStatus('Failed to save reasons.');
//       }
//     } catch (err) {
//       setSaveStatus('Error saving reasons.');
//     }
//   };

//   if (loading) {
//     return <div>Loading data...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//       <h2>Device OFF Status Data</h2>

//       {/* Save Button */}
//       <button onClick={handleSave} style={{ marginBottom: '10px' }}>
//         Save Reasons to DB
//       </button>
//       {saveStatus && <div style={{ marginBottom: '10px' }}>{saveStatus}</div>}

//       {/* Data Table */}
//       <table
//         style={{
//           width: '100%',
//           borderCollapse: 'collapse',
//           marginTop: '10px',
//         }}
//       >
//         <thead>
//           <tr>
//             <th style={tableHeaderStyle}>Device No</th>
//             <th style={tableHeaderStyle}>Channel</th>
//             <th style={tableHeaderStyle}>Date</th>
//             <th style={tableHeaderStyle}>Time</th>
//             <th style={tableHeaderStyle}>Status</th>
//             <th style={tableHeaderStyle}>Shift</th>
//             <th style={tableHeaderStyle}>End Date</th>
//             <th style={tableHeaderStyle}>End Time</th>
//             <th style={tableHeaderStyle}>Reason</th> {/* New Column */}
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item) => (
//             <tr key={item._id}>
//               <td style={tableCellStyle}>{item.deviceno}</td>
//               <td style={tableCellStyle}>{item.channel}</td>
//               <td style={tableCellStyle}>{item.date}</td>
//               <td style={tableCellStyle}>{item.time}</td>
//               <td style={tableCellStyle}>{item.status}</td>
//               <td style={tableCellStyle}>{item.shift}</td>
//               <td style={tableCellStyle}>{item.enddate}</td>
//               <td style={tableCellStyle}>{item.endtime}</td>
//               <td style={tableCellStyle}>{item.reason || 'N/A'}</td> {/* Display Reason */}
//             </tr>
//           ))}
//           {data.length === 0 && (
//             <tr>
//               <td colSpan="9" style={{ textAlign: 'center' }}>
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
// };

// const tableCellStyle = {
//   border: '1px solid #ddd',
//   padding: '8px',
// };

// export default BreakDataEntry;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from './URL.js';

const BreakDataEntry = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  // Available reasons for the dropdown
  const [reasonsList, setReasonsList] = useState([]);
  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const response = await axios.get(`${URL}/get_reasons/${localStorage.getItem("ID")}`);
        
        // Ensure the response has the correct data structure
        if (response.data && Array.isArray(response.data.data)) {
          // Map the reasons to label-value pairs
          const fetchedReasons = response.data.data.map(reason => ({
            label: reason.reason,
            value: reason._id,
          }));
          setReasonsList(fetchedReasons);
        } else {
          console.error('Unexpected response format for reasons:', response);
          setError('Unexpected response format when fetching reasons.');
        }
      } catch (err) {
        console.error('Error fetching reasons:', err);
        setError('Error fetching reasons.');
      }
    };

    fetchReasons();
  }, []);



  // Store selected reasons in a separate state
  const [selectedReasons, setSelectedReasons] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${URL}/ONOff`);
        const offData = response.data.data.filter(item => item.status === 'OFF');
        setData(offData); // Set the filtered data
        setLoading(false);
      } catch (err) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle dropdown selection changes for each row
  const handleReasonChange = (id, reason) => {
    setSelectedReasons((prev) => ({
      ...prev,
      [id]: reason,
    }));
  };

  const handleSave = async () => {
    try {
      // Prepare data with selected reasons
      const dataWithReasons = data.map(item => ({
        ...item,
        reason: selectedReasons[item._id] || item.reason, // Use selected reason or existing one
      }));

      // Send POST request to save reasons
      const response = await axios.post(`${URL}/save_off_reasons`, { reasons: dataWithReasons });
      if (response.status === 200) {
        setSaveStatus('Reasons saved successfully!');
      } else {
        setSaveStatus('Failed to save reasons.');
      }
    } catch (err) {
      setSaveStatus('Error saving reasons.');
    }
  };

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Device OFF Status Data</h2>

      {/* Save Button */}
      <button onClick={handleSave} style={{ marginBottom: '10px' }}>
        Save Reasons to DB
      </button>
      {saveStatus && <div style={{ marginBottom: '10px' }}>{saveStatus}</div>}

      {/* Data Table */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '10px',
        }}
      >
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Device No</th>
            <th style={tableHeaderStyle}>Channel</th>
            <th style={tableHeaderStyle}>Date</th>
            <th style={tableHeaderStyle}>Time</th>
            <th style={tableHeaderStyle}>Status</th>
            <th style={tableHeaderStyle}>Shift</th>
            <th style={tableHeaderStyle}>End Date</th>
            <th style={tableHeaderStyle}>End Time</th>
            <th style={tableHeaderStyle}>Reason</th> {/* New Column */}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td style={tableCellStyle}>{item.deviceno}</td>
              <td style={tableCellStyle}>{item.channel}</td>
              <td style={tableCellStyle}>{item.date}</td>
              <td style={tableCellStyle}>{item.time}</td>
              <td style={tableCellStyle}>{item.status}</td>
              <td style={tableCellStyle}>{item.shift}</td>
              <td style={tableCellStyle}>{item.enddate}</td>
              <td style={tableCellStyle}>{item.endtime}</td>
              <td style={tableCellStyle}>
                {/* Dropdown for selecting a reason */}
                <select
                value={selectedReasons[item._id] || item.reason || ''}
                onChange={(e) => handleReasonChange(item._id, e.target.value)}
              >
                <option value="" disabled>Select Reason</option>
                {reasonsList.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan="9" style={{ textAlign: 'center' }}>
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Styles for table headers and cells
const tableHeaderStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  backgroundColor: '#f2f2f2',
};

const tableCellStyle = {
  border: '1px solid #ddd',
  padding: '8px',
};

export default BreakDataEntry;
