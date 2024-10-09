
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from './URL.js';

const BreakDataEntry = () => {
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const [reasonsList, setReasonsList] = useState([]);
  const [selectedReasons, setSelectedReasons] = useState({});
  const [savedReasons, setSavedReasons] = useState([]); // To store the reasons already saved
  const [visibleMachines, setVisibleMachines] = useState({}); // For managing collapsibility of each machine

  // Fetch available reasons
  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const response = await axios.get(`${URL}/get_reasons/${localStorage.getItem('ID')}`);
        if (response.data && Array.isArray(response.data.data)) {
          const fetchedReasons = response.data.data.map((reason) => ({
            label: reason.reason,
            value: reason._id,
          }));
          setReasonsList(fetchedReasons);
        } else {
          setError('Unexpected response format when fetching reasons.');
        }
      } catch (err) {
        setError('Error fetching reasons.');
      }
    };
    fetchReasons();
  }, []);

  // Fetch data and group by device and channel
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${URL}/ONOff`);
        const offData = response.data.data.filter((item) => item.status === 'OFF');
        const grouped = groupDataByDevice(offData);
        setGroupedData(grouped);
        setLoading(false);
      } catch (err) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    const fetchSavedReasons = async () => {
      try {
        const response = await axios.get(`${URL}/get_save_off_reasons`);
        setSavedReasons(response.data.data); // Store saved reasons
      } catch (err) {
        console.error('Error fetching saved reasons:', err);
      }
    };

    fetchData();
    fetchSavedReasons();
  }, []);

  // Group data by device and channel
  const groupDataByDevice = (data) => {
    return data.reduce((acc, item) => {
      const machineKey = `Device ${item.deviceno} - ${item.channel.toUpperCase()}`;
      if (!acc[machineKey]) {
        acc[machineKey] = [];
      }
      acc[machineKey].push(item);
      return acc;
    }, {});
  };

  // Check if a reason is already saved for the given item
  const isReasonSaved = (item) => {
    return savedReasons.some(
      (saved) =>
        saved.deviceno === item.deviceno &&
        saved.channel === item.channel &&
        saved.shift === item.shift &&
        saved.date === item.date
    );
  };

  // Handle reason selection
  const handleReasonChange = (id, reason) => {
    setSelectedReasons((prev) => ({
      ...prev,
      [id]: reason,
    }));
  };

  // Handle save button action
  const handleSave = async () => {
    try {
      const dataWithReasons = Object.values(groupedData)
        .flat()
        .map((item) => ({
          ...item,
          reason: selectedReasons[item._id] || item.reason, // Use selected or existing reason
        }));
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

  // Toggle visibility of each machine section
  const toggleMachineVisibility = (machineKey) => {
    setVisibleMachines((prevState) => ({
      ...prevState,
      [machineKey]: !prevState[machineKey],
    }));
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

      {/* Render grouped data by machine and channel */}
      {Object.keys(groupedData).map((machineKey) => (
        <div key={machineKey}>
          <h3
            style={{ cursor: 'pointer' }}
            onClick={() => toggleMachineVisibility(machineKey)}
          >
            {visibleMachines[machineKey] ? '▼' : '▶'} {machineKey}
          </h3>
          {visibleMachines[machineKey] && (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
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
                  <th style={tableHeaderStyle}>Reason</th>
                </tr>
              </thead>
              <tbody>
                {groupedData[machineKey].map((item) => (
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
                      {/* Display saved reason or show dropdown if reason is not saved */}
                      {isReasonSaved(item) ? (
                        <span>{item.reason}</span> // Display saved reason
                      ) : (
                        <select
                          value={selectedReasons[item._id] || item.reason || ''}
                          onChange={(e) => handleReasonChange(item._id, e.target.value)}
                        >
                          <option value="" disabled>
                            Select Reason
                          </option>
                          {reasonsList.map((reason) => (
                            <option key={reason.value} value={reason.value}>
                              {reason.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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

export default BreakDataEntry;
