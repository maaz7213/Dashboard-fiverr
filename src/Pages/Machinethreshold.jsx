
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { URL } from './URL.js';
// import './MasterMachine.css';  // Import the CSS file

// function MasterMachine() {
//   const [groupedData, setGroupedData] = useState({});
//   const [filteredData, setFilteredData] = useState({});
//   const [deviceFilter, setDeviceFilter] = useState('');  // For filtering by device number
//   const [loading, setLoading] = useState(true);          // Loading state
//   const [deviceOptions, setDeviceOptions] = useState([]); // Store unique device IDs

//   // Helper function to group data by device number and sort by date
//   const groupDataByDevice = (data) => {
//     const grouped = {};

//     // Group by device number
//     data.forEach(item => {
//       const deviceNo = item._id.deviceno;
//       if (!grouped[deviceNo]) {
//         grouped[deviceNo] = [];
//       }
//       grouped[deviceNo].push(item);
//     });

//     // Sort each group by date
//     Object.keys(grouped).forEach(deviceNo => {
//       grouped[deviceNo].sort((a, b) => {
//         const dateA = new Date(a._id.date.split('/').reverse().join('-'));
//         const dateB = new Date(b._id.date.split('/').reverse().join('-'));
//         return dateB - dateA;  // Sort descending by date (most recent first)
//       });
//     });

//     return grouped;
//   };

//   // Fetch the list of unique device IDs on component mount
//   useEffect(() => {
//     axios.get(`${URL}/machine_threshold`)
//       .then(response => {
//         setDeviceOptions(response.data.uniqueDeviceIds); // Populate the dropdown with unique device IDs
//       })
//       .catch(error => {
//         console.error('Error fetching device IDs:', error);
//       });
//   }, []);

//   // Fetch device-specific data when the selected device changes
//   useEffect(() => {
//     if (deviceFilter) {
//       setLoading(true);  // Set loading state to true before data fetch
//       axios.get(`${URL}/machine_threshold/${deviceFilter}`)  // Adjust to your API endpoint for device-specific data
//         .then(response => {
//           const grouped = groupDataByDevice(response.data.message);
//           setGroupedData(grouped);
//           setFilteredData(grouped);  // Apply the grouped data
//           setLoading(false);  // Set loading state to false after data is fetched
//         })
//         .catch(error => {
//           console.error('Error fetching device data:', error);
//           setLoading(false);  // Stop loading if there's an error
//         });
//     }
//   }, [deviceFilter]); // Refetch data when deviceFilter changes

//   return (
//     <div>
//       <h1>Device Data</h1>

//       {/* Dropdown to select the device number */}
//       <div>
//         <label htmlFor="deviceFilter">Select Device Number: </label>
//         <select
//           id="deviceFilter"
//           value={deviceFilter}
//           onChange={e => setDeviceFilter(e.target.value)}
//         >
//           <option value="">-- Select Device --</option>
//           {deviceOptions.map(deviceId => (
//             <option key={deviceId} value={deviceId}>
//               {deviceId}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Loader */}
//       {loading ? (
//         <div className="loader">Loading data, please wait...</div>
//       ) : (
//         <div className="device-data-list">
//           {Object.keys(filteredData).length === 0 ? (
//             <p>No data available for the selected filters.</p>
//           ) : (
//             Object.keys(filteredData).map(deviceNo => (
//               <div key={deviceNo} className="device-group">
//                 <h2>Device Number: {deviceNo.deviceno}</h2>
//                 {filteredData[deviceNo].map((item, index) => (
//                   <div key={index} className="device-data-item">
//                     <h3>Device ID: {item._id}</h3>
                
//                     {/* Render lookup values */}
//                     <h4>Lookup Values:</h4>
//                     {Array.from({ length: 8 }, (_, i) => (
//                       <p key={`lookup-ch${i + 1}`}>
//                         <strong>CH{i + 1} Lookup:</strong> {item[`ch${i + 1}_lookup`] || 'N/A'}
//                       </p>
//                     ))}
                
//                     {/* Render shift thresholds for each channel */}
//                     <h4>Shift Thresholds:</h4>
//                     {Array.from({ length: 8 }, (_, i) => {
//                       const shift1 = item[`ch${i + 1}_shift1_theshold`];
//                       const shift2 = item[`ch${i + 1}_shift2_theshold`];
                
//                       return (
//                         <div key={`shift-ch${i + 1}`}>
//                           <h5>CH{i + 1} Shift Thresholds:</h5>
//                           {shift1 && (
//                             <p>
//                               <strong>Shift 1 ({shift1.name}):</strong> Start {shift1.start}, Stop {shift1.stop}, Total {shift1.total}
//                             </p>
//                           )}
//                           {shift2 && (
//                             <p>
//                               <strong>Shift 2 ({shift2.name}):</strong> Start {shift2.start}, Stop {shift2.stop}, Total {shift2.total}
//                             </p>
//                           )}
//                         </div>
//                       );
//                     })}
                
//                     {/* Render average values */}
//                     <h4>Average Values:</h4>
//                     {Array.from({ length: 8 }, (_, i) => (
//                       <p key={`average-ch${i + 1}`}>
//                         <strong>CH{i + 1} Average:</strong> {item[`ch${i + 1}_average`] || 'N/A'}
//                       </p>
//                     ))}
//                   </div>
//                 ))}
                
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default MasterMachine;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from './URL.js';
import './MasterMachine.css';  // Import the CSS file

function MasterMachine() {
  const [groupedData, setGroupedData] = useState({});
  const [filteredData, setFilteredData] = useState({});
  const [deviceFilter, setDeviceFilter] = useState('');  // For filtering by device number
  const [loading, setLoading] = useState(true);          // Loading state
  const [deviceOptions, setDeviceOptions] = useState([]); // Store unique device IDs

  // Helper function to group data by device number and sort by date
  const groupDataByDevice = (data) => {
    const grouped = {};

    // Group by device number
    data.forEach(item => {
      const deviceNo = item._id.deviceno;
      if (!grouped[deviceNo]) {
        grouped[deviceNo] = [];
      }
      grouped[deviceNo].push(item);
    });

    // Sort each group by date
    Object.keys(grouped).forEach(deviceNo => {
      grouped[deviceNo].sort((a, b) => {
        const dateA = new Date(a._id.date.split('/').reverse().join('-'));
        const dateB = new Date(b._id.date.split('/').reverse().join('-'));
        return dateB - dateA;  // Sort descending by date (most recent first)
      });
    });

    console.log("Grouped and sorted data:", grouped); // Log the grouped data
    return grouped;
  };

  // Fetch the list of unique device IDs on component mount
  useEffect(() => {
    console.log('Fetching unique device IDs...'); // Log before fetching
    axios.get(`${URL}/machine_threshold`)
      .then(response => {
        console.log('Device IDs fetched:', response.data.uniqueDeviceIds); // Log fetched device IDs
        setDeviceOptions(response.data.uniqueDeviceIds); // Populate the dropdown with unique device IDs
      })
      .catch(error => {
        console.error('Error fetching device IDs:', error);
      });
  }, []);

  // Fetch device-specific data when the selected device changes
  useEffect(() => {
    if (deviceFilter) {
      console.log(`Fetching data for device: ${deviceFilter}`); // Log selected device filter
      setLoading(true);  // Set loading state to true before data fetch
      axios.get(`${URL}/machine_threshold/${deviceFilter}`)  // Adjust to your API endpoint for device-specific data
        .then(response => {
          console.log('Data fetched for the device:', response.data.message); // Log fetched data
          const grouped = groupDataByDevice(response.data.message);
          setGroupedData(grouped);
          setFilteredData(grouped);  // Apply the grouped data
          setLoading(false);  // Set loading state to false after data is fetched
        })
        .catch(error => {
          console.error('Error fetching device data:', error);
          setLoading(false);  // Stop loading if there's an error
        });
    }
  }, [deviceFilter]); // Refetch data when deviceFilter changes

  return (
    <div>
      <h1>Device Data</h1>

      {/* Dropdown to select the device number */}
      <div>
        <label htmlFor="deviceFilter">Select Device Number: </label>
        <select
          id="deviceFilter"
          value={deviceFilter}
          onChange={e => {
            console.log(`Device filter changed: ${e.target.value}`); // Log filter change
            setDeviceFilter(e.target.value);
          }}
        >
          <option value="">-- Select Device --</option>
          {deviceOptions.map(deviceId => (
            <option key={deviceId} value={deviceId}>
              {deviceId}
            </option>
          ))}
        </select>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="loader">Loading data, please wait...</div>
      ) : (
        <div className="device-data-list">
          {Object.keys(filteredData).length === 0 ? (
            <p>No data available for the selected filters.</p>
          ) : (
            Object.keys(filteredData).map(deviceNo => (
              <div key={deviceNo} className="device-group">
                <h2>Device Number: {deviceNo.deviceno}</h2>
                {filteredData[deviceNo].map((item, index) => (
                  <div key={index} className="device-data-item">
                    <h3>Device ID: {item._id}</h3>
                
                    {/* Render lookup values */}
                    <h4>Lookup Values:</h4>
                    {Array.from({ length: 8 }, (_, i) => (
                      <p key={`lookup-ch${i + 1}`}>
                        <strong>CH{i + 1} Lookup:</strong> {item[`ch${i + 1}_lookup`] || 'N/A'}
                      </p>
                    ))}
                
                    {/* Render shift thresholds for each channel */}
                    <h4>Shift Thresholds:</h4>
                    {Array.from({ length: 8 }, (_, i) => {
                      const shift1 = item[`ch${i + 1}_shift1_theshold`];
                      const shift2 = item[`ch${i + 1}_shift2_theshold`];
                
                      return (
                        <div key={`shift-ch${i + 1}`}>
                          <h5>CH{i + 1} Shift Thresholds:</h5>
                          {shift1 && (
                            <p>
                              <strong>Shift 1 ({shift1.name}):</strong> Start {shift1.start}, Stop {shift1.stop}, Total {shift1.total}
                            </p>
                          )}
                          {shift2 && (
                            <p>
                              <strong>Shift 2 ({shift2.name}):</strong> Start {shift2.start}, Stop {shift2.stop}, Total {shift2.total}
                            </p>
                          )}
                        </div>
                      );
                    })}
                
                    {/* Render average values */}
                    <h4>Average Values:</h4>
                    {Array.from({ length: 8 }, (_, i) => (
                      <p key={`average-ch${i + 1}`}>
                        <strong>CH{i + 1} Average:</strong> {item[`ch${i + 1}_average`] || 'N/A'}
                      </p>
                    ))}
                  </div>
                ))}
                
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default MasterMachine;
