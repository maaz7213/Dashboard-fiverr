
import React, { useEffect, useState } from 'react';
import { URL } from './URL.js';
import axios from 'axios';
import './OperatorEntry.css';

const OperatorEntry = () => {
  const [machineData, setMachineData] = useState({});
  const [data, setData] = useState([]);
  const [operatorSelections, setOperatorSelections] = useState([]); // Store selections from get_operator_selections API
  const [operators, setOperators] = useState([]);
  const [loadingOperators, setLoadingOperators] = useState(true);
  const [errorOperators, setErrorOperators] = useState(null);
  const [loading, setLoading] = useState(true);

  // State for selected operators
  const [selectedOperators, setSelectedOperators] = useState({});

  // Fetch machine data from shiftwise API
  const fetchMachineData = () => {
    setLoading(true);
    axios
      .get(`${URL}/shiftwise`)
      .then((response) => {
        console.log('Shiftwise API response:', response.data);
        setData(response.data.message);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching shiftwise data:', error);
        setLoading(false);
      });
  };

  // Fetch operator selections from get_operator_selections API
  const fetchOperatorSelections = () => {
    axios
      .get(`${URL}/get_operator_selections`)
      .then((response) => {
        console.log('Operator selections:', response.data.data);
        setOperatorSelections(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching operator selections:', error);
      });
  };

  useEffect(() => {
    fetchMachineData();
    fetchOperatorSelections();
  }, []);

  // Process machine data to include channel and shift information
  useEffect(() => {
    const processedData = {};

    data.forEach((machine) => {
      Object.keys(machine).forEach((key) => {
        if (key.startsWith('ch')) {
          const channelData = machine[key];
          const machineKey = `Device ${machine.deviceno} - ${key.toUpperCase()}`;

          if (!processedData[machineKey]) {
            processedData[machineKey] = [];
          }

          Object.keys(channelData).forEach((shiftKey) => {
            const shiftData = channelData[shiftKey];
            const selectionExists = operatorSelections.some(
              (selection) =>
                selection.deviceno === machine.deviceno &&
                selection.channel === key &&
                selection.shift === shiftKey &&
                selection.date === machine.currentdate
            );

            // Only include shift if it's not already in operator selections
            if (!selectionExists) {
              processedData[machineKey].push({
                shift: shiftKey,
                channel: key,
                ...shiftData,
                currentdate: machine.currentdate,
                deviceno: machine.deviceno,
                _id: machine._id || `${machine.deviceno}_${shiftKey}_${machine.currentdate}`,
              });
            }
          });
        }
      });
    });

    console.log('Processed machine data:', processedData); // Debugging: Log the processed machine data
    setMachineData(processedData);
  }, [data, operatorSelections]);

  const processdatatofilter = () => {
    const userId = localStorage.getItem('ID');
    if (!userId) {
      console.error('User ID not found in localStorage.');
      setErrorOperators('User ID not found.');
      setLoadingOperators(false);
      return;
    }
    axios
      .get(`${URL}/get_operators_by_userid/${userId}`)
      .then((response) => {
        console.log('Operators fetched:', response.data.operators);
        setOperators(response.data.operators);
        setLoadingOperators(false);
      })
      .catch((err) => {
        console.error('Error fetching operators:', err);
        setErrorOperators('Error fetching operators');
        setLoadingOperators(false);
      });
  };

  // Initialize selected operators from localStorage
  useEffect(() => {
    const storedOperators = localStorage.getItem('selectedOperators');
    if (storedOperators) {
      setSelectedOperators(JSON.parse(storedOperators));
    }
  }, []);

  // Handle operator selection changes
  const handleOperatorChange = (uniqueKey, operatorId, item) => {
    setSelectedOperators((prevState) => {
      const newState = {
        ...prevState,
        [uniqueKey]: operatorId,
      };
      localStorage.setItem('selectedOperators', JSON.stringify(newState));

      // Save the operator selection to the server
      saveOperatorSelection(item, operatorId);

      return newState;
    });
  };

  // Save operator selection to the server
  const saveOperatorSelection = (item, operatorId) => {
    const payload = {
      deviceno: item.deviceno,
      channel: item.channel || 'unknown',
      date: item.currentdate,
      shift: item.shift,
      operatorId: operatorId,
    };

    console.log('Saving operator selection:', payload);

    axios
      .post(`${URL}/save_operator_selection`, payload)
      .then((response) => {
        console.log('Operator selection saved:', response.data);
        fetchMachineData();
        fetchOperatorSelections();
      })
      .catch((error) => {
        console.error('Error saving operator selection:', error);
      });
  };

  // Manage visibility of each machine's table
  const [visibleMachines, setVisibleMachines] = useState({});

  // Toggle machine table visibility
  const toggleMachineVisibility = (machineKey) => {
    setVisibleMachines((prevState) => ({
      ...prevState,
      [machineKey]: !prevState[machineKey],
    }));
  };

  // Define table headers
  const tableHeaders = (
    <thead>
      <tr>
        <th>Date</th>
        <th>Shift</th>
        <th>Shift Time</th>
        <th>Run Time</th>
        <th>Working Time</th>
        <th>Operator</th>
      </tr>
    </thead>
  );

  // Format time strings
  const formatTime = (timeStr) => {
    if (typeof timeStr !== 'string' || !timeStr) return 'Running';
    const parts = timeStr.split(':').map((part) => part.padStart(2, '0'));
    return parts.join(':');
  };


  useEffect(()=>{
    processdatatofilter()
  },[])
  if (loading) {
    return <div>Loading data...</div>;
  }

  return (
    <div className="operator-entry">
      <h2>OPERATOR ENTRY</h2>

      {/* Refresh Data Button */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => {
            fetchMachineData();
            fetchOperatorSelections();
            
          }}
        >
          Refresh Data
        </button>
      </div>

      {machineData &&
        Object.keys(machineData).map((machineKey) => {
          // Only show the device and channel if there's data for that machineKey
          if (machineData[machineKey].length === 0) {
            return null;
          }

          return (
            <div key={machineKey}>
              <h3
                className="machine-header"
                onClick={() => toggleMachineVisibility(machineKey)}
                style={{ cursor: 'pointer' }}
              >
                {visibleMachines[machineKey] ? '▼' : '▶'} {machineKey}
              </h3>
              {visibleMachines[machineKey] && (
                <table className="machine-table">
                  {tableHeaders}
                  <tbody>
                    {machineData[machineKey].map((item, index) => {
                      const uniqueKey = `${machineKey}_${item.shift}_${item.channel}_${index}`;
                      return (
                        <tr key={uniqueKey}>
                          <td>{item.currentdate}</td>
                          <td>{item.shift}</td>
                          <td>{formatTime(item.shift_time)}</td>
                          <td>{item.run_time}</td>
                          <td>{item.working_time}</td>
                          <td>
                            {loadingOperators ? (
                              <span>Loading operators...</span>
                            ) : errorOperators ? (
                              <span>{errorOperators}</span>
                            ) : (
                              <select
                                value={selectedOperators[uniqueKey] || ''}
                                onChange={(e) =>
                                  handleOperatorChange(uniqueKey, e.target.value, item)
                                }
                              >
                                <option value="">Select Operator</option>
                                {operators.map((operator) => (
                                  <option key={operator.id} value={operator.id}>
                                    {operator.name}
                                  </option>
                                ))}
                              </select>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default OperatorEntry;
