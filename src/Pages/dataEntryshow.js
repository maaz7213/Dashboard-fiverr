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

//         console.log("operatorsData" ,operatorsMap );
//         // Attach operator names to the data or use operatorId directly if no name is found
//         const dataWithOperatorNames = selections.map((item) => ({
//           ...item,
//           operatorName: operatorsMap[item.operatorId] || item.operatorId || 'Unknown',
//         }));
//         console.log("dataWithOperatorNames" ,dataWithOperatorNames);
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
//   }, [URL]);

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
//             <th style={tableHeaderStyle}>Machine</th>
//             <th style={tableHeaderStyle}>Date</th>
//             <th style={tableHeaderStyle}>Shift</th>
//             <th style={tableHeaderStyle}>Operator Name</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredData.map((item) => (
//             <tr key={item._id}>
//               <td style={tableCellStyle}>{item.deviceno}</td>
//               <td style={tableCellStyle}>{item.channel}</td>
//               <td style={tableCellStyle}>
//                 MACH {item.channel}
//               </td>
//               <td style={tableCellStyle}>{item.date}</td>
//               <td style={tableCellStyle}>{item.shift}</td>
//               <td style={tableCellStyle}>{item.operatorName}</td>
//             </tr>
//           ))}
//           {filteredData.length === 0 && (
//             <tr>
//               <td colSpan="8" style={{ textAlign: 'center' }}>
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

// export default DataEntryshow;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from './URL.js';

const DataEntryshow = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [operators, setOperators] = useState([]);
  const [operatorFilter, setOperatorFilter] = useState('');
  const [shiftFilter, setShiftFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${URL}/get_operator_selections`);
        const selections = response.data.data;

        // Fetch operators to get operator names
        const operatorsResponse = await axios.get(
          `${URL}/get_operators_by_userid/${localStorage.getItem('ID')}`
        );
        const operatorsData = operatorsResponse.data.operators;

        // Map operator IDs to names
        const operatorsMap = {};
        operatorsData.forEach((operator) => {
          operatorsMap[operator._id] = operator.name;
        });

        // Attach operator names to the data or use operatorId directly if no name is found
        const dataWithOperatorNames = selections.map((item) => ({
          ...item,
          operatorName: operatorsMap[item.operatorId] || item.operatorId || 'Unknown',
        }));

        setData(dataWithOperatorNames);
        setFilteredData(dataWithOperatorNames);
        setOperators(operatorsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle operator filter change
  const handleOperatorFilterChange = (e) => {
    setOperatorFilter(e.target.value);
  };

  // Handle shift filter change
  const handleShiftFilterChange = (e) => {
    setShiftFilter(e.target.value);
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = data;

    if (operatorFilter) {
      filtered = filtered.filter(
        (item) => item.operatorName === operatorFilter
      );
    }

    if (shiftFilter) {
      filtered = filtered.filter((item) =>
        item.shift.toLowerCase().includes(shiftFilter.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  // Reset filters
  const resetFilters = () => {
    setOperatorFilter('');
    setShiftFilter('');
    setFilteredData(data);
  };

  // Group data by date
  const groupDataByDate = (data) => {
    return data.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = [];
      }
      acc[item.date].push(item);
      return acc;
    }, {});
  };

  const groupedData = groupDataByDate(filteredData);

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Get unique operator names for the dropdown
  const operatorNames = [...new Set(data.map((item) => item.operatorName))];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Operator Selections</h2>

      {/* Filter Form */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="operatorFilter" style={{ marginRight: '10px' }}>
          Operator Name:
        </label>
        <select
          id="operatorFilter"
          value={operatorFilter}
          onChange={handleOperatorFilterChange}
          style={{ marginRight: '20px', padding: '5px' }}
        >
          <option value="">All Operators</option>
          {operatorNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <label htmlFor="shiftFilter" style={{ marginRight: '10px' }}>
          Shift:
        </label>
        <input
          type="text"
          id="shiftFilter"
          value={shiftFilter}
          onChange={handleShiftFilterChange}
          placeholder="Enter shift"
          style={{ marginRight: '20px', padding: '5px' }}
        />

        <button onClick={applyFilters} style={{ marginRight: '10px' }}>
          Apply Filters
        </button>
        <button onClick={resetFilters}>Reset Filters</button>
      </div>

      {/* Render tables grouped by date */}
      {Object.keys(groupedData).map((date) => (
        <div key={date} style={{ marginBottom: '40px' }}>
          <h3>Data for {date}</h3>
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
                <th style={tableHeaderStyle}>Machine</th>
                <th style={tableHeaderStyle}>Date</th>
                <th style={tableHeaderStyle}>Shift</th>
                <th style={tableHeaderStyle}>Operator Name</th>
              </tr>
            </thead>
            <tbody>
              {groupedData[date].map((item) => (
                <tr key={item._id}>
                  <td style={tableCellStyle}>{item.deviceno}</td>
                  <td style={tableCellStyle}>{item.channel}</td>
                  <td style={tableCellStyle}>MACH {item.channel}</td>
                  <td style={tableCellStyle}>{item.date}</td>
                  <td style={tableCellStyle}>{item.shift}</td>
                  <td style={tableCellStyle}>{item.operatorName}</td>
                </tr>
              ))}
              {groupedData[date].length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>
                    No Data Found
                  </td>
                </tr>
              )}
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
};

const tableCellStyle = {
  border: '1px solid #ddd',
  padding: '8px',
};

export default DataEntryshow;
