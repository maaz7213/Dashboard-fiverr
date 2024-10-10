

import React, { useState, useEffect } from 'react';
import './MWReport.css';
import BarChartPlaceholder from '../Components/BarChartPlaceholder';
import axios from 'axios'; // Axios for fetching data
import CircularProgress from '../Components/Progress';
import dayjs from 'dayjs'; // For handling date logic
import isBetween from 'dayjs/plugin/isBetween'; // Import isBetween plugin

dayjs.extend(isBetween); // Extend dayjs with isBetween plugin

const MWReport = () => {
  const [reportData, setReportData] = useState([]); // Report data fetched from API
  const [filteredData, setFilteredData] = useState([]); // Filtered data based on date range
  const [selectedFilter, setSelectedFilter] = useState('Day'); // Default filter is 'Day'
  const [selectedShift, setSelectedShift] = useState('all'); // Default shift filter
  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day').format('YYYY-MM-DD')); // Start date (default 1 week back)
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD')); // End date (current date by default)
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [operator , setOperator] = useState([])
  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      // console.log('Fetching data'); // CLG 1
      try {
        const response = await axios.get('https://dashboard-fiverr-nodejs.vercel.app/shiftwise');
        // console.log('API Response:', response.data.message); // CLG 2
        setReportData(response.data.message); // Set report data from the response
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
    const fetchData = async () => {
      // console.log('Fetching data'); // CLG 1
      try {
        const response = await axios.get('https://dashboard-fiverr-nodejs.vercel.app/get_operator_selections');
        // console.log('API Response:', response.data.message); // CLG 2
        setOperator(response.data.data); // Set report data from the response
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
  
      const filtered = reportData.filter((report) => {
        console.log("Filter by date range:", report.currentdate, { formattedStartDate, formattedEndDate });
  
        const [year, month, day] = report.currentdate.split('/');
        const fullYear = year.length === 2 ? `20${year}` : year;
        const reportDate = dayjs(`${fullYear}-${month}-${day}`, 'YYYY-MM-DD');
  
        console.log("Converted report date:", reportDate.format('YYYY-MM-DD'));
  
        if (!reportDate.isValid()) {
          console.log("Invalid report date:", reportDate);
          return false;
        }
  
        const isWithinRange = reportDate.isBetween(formattedStartDate, formattedEndDate, 'day', '[]');
        console.log(`Is ${reportDate.format('YYYY-MM-DD')} within range?`, isWithinRange);
        if (!isWithinRange) return false;
  
        const filteredChannels = {};
  
        Object.keys(report).forEach((channelKey) => {
          if (channelKey.startsWith('ch')) {
            const shiftData = report[channelKey];
            filteredChannels[channelKey] = {};
  
            ['morning', 'evening', 'night'].forEach((shift) => {
              if (selectedShift === 'all' || shift === selectedShift) {
                if (shiftData && shiftData[shift]) {
                  filteredChannels[channelKey][shift] = shiftData[shift];
                }
              }
            });
          }
        });
  
        return Object.keys(filteredChannels).length > 0 ? { ...report, ...filteredChannels } : false;
      });
  
      console.log("Filtered data after date and shift:", filtered);
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
    <h1>Machine Wise Report</h1>
  
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
          className={selectedShift === 'evening' ? 'active' : ''}
          onClick={() => handleShiftChange('evening')}
        >
          Evening
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
                    <h3>{channelKey.toUpperCase()}</h3>
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
                
                      // Convert shift_time and run_time to minutes
                      const shiftTimeInMinutes = convertTimeToMinutes(shiftData.shift_time);
                      const runTimeInMinutes = convertTimeToMinutes(shiftData.run_time);
                      console.log(shiftData.run_time);
                      // Calculate runPercentage
                      const runPercentage = shiftTimeInMinutes > 0
                        ? (shiftData.run_time / shiftTimeInMinutes) * 100
                        : 0;
                
                      // Calculate averagePercentage
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
                          colors={["#f94144", "#f8961e", "#43aa8b"]}
                        />
                          <p>Shift Duration: {shiftTimeInMinutes || 'N/A'} min</p>
                          <p>Run Time: {shiftData.run_time || 'N/A'} minutes ({runPercentage.toFixed(2)}%)</p>
                          <p>Average: {shiftData.average || 'N/A'} ({averagePercentage.toFixed(2)}%)</p>
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

export default MWReport;
