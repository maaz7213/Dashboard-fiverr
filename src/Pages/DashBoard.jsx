import React, { useEffect, useState } from 'react';
import { Modal } from 'antd'; // Ant Design's Modal component
import BarChartPlaceholder from '../Components/BarChartPlaceholder';
import 'react-circular-progressbar/dist/styles.css';
import 'antd/dist/reset.css'; // Ant Design CSS
import './DashBoard.css'; // Custom CSS
import CircularProgress from '../Components/Progress';
import axios from 'axios';
import dayjs from 'dayjs';
import { URL } from './URL';

function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [shiftData, setShiftData] = useState([]); // Raw API data
  const [todayData, setTodayData] = useState([]); // For storing today's filtered data
  const [yesterdayData, setYesterdayData] = useState([]); // For storing yesterday's filtered data
  const [selectedDate, setSelectedDate] = useState('today'); // 'today' or 'yesterday'
  const [selectedShift, setSelectedShift] = useState('morning'); // 'morning', 'evening', or 'all'

  // Helper function to convert shift_time to hours
  const getShiftTimeInHours = (shift_time) => {
    console.log("Converting shift_time to hours:", shift_time); // Debugging
    if (typeof shift_time === 'string') {
      const [hours, minutes, seconds] = shift_time.split(':').map(Number);
      return hours + minutes / 60 + seconds / 3600;
    } else if (typeof shift_time === 'number') {
      return shift_time / 60; // Assuming the number represents minutes
    }
    return 0;
  };



  const convertTimeToMinutes = (timeStr) => {
    if (typeof timeStr === 'string' && timeStr.includes(':')) {
      const [hours, minutes, seconds] = timeStr.split(':').map(Number);
      return hours * 60 + minutes + (seconds ? seconds / 60 : 0); // Convert seconds to minutes
    }
    return 0; // Default to 0 if timeStr is not a valid format
  };

  // Convert shift_time and run_time to seconds

  // Convert shift_time and run_time to minutes
  
  // Helper function to calculate percentages
  const calculatePercentages = (run_time, shift_time, average, average_threshold) => {
    console.log("Calculating Percentages:", { run_time, shift_time, average, average_threshold }); // Debugging
    const shiftTimeInMinutes = convertTimeToMinutes(shiftData.shift_time);


    const runPercentage = shiftTimeInMinutes > 0 ? (run_time / shiftTimeInMinutes) * 100 : 0;
    const averagePercentage = average_threshold > 0 ? (average / average_threshold) * 100 : 0;
    return [runPercentage, averagePercentage];
  };

  // Helper function to process shift data for each device
  const processShiftData = (data) => {
    return data.map(device => {
      const channels = {};
      for (let key in device) {
        if (key.startsWith('ch')) { // Process channels ch1 to ch8
          const channel = device[key];
          channels[key] = {};

          ['morning', 'evening'].forEach(shift => { // Focus on morning and evening shifts
            if (channel[shift]) {
              const shiftTimeInHours = getShiftTimeInHours(channel[shift].shift_time);
              channels[key][shift] = {
                run_time: channel[shift].run_time,
                shift_time: shiftTimeInHours,
                average: channel[shift].average,
                average_threshold: channel[shift].average_threshold,
                percentages: calculatePercentages(
                  channel[shift].run_time,
                  channel[shift].shift_time,
                  channel[shift].average,
                  channel[shift].average_threshold
                )
              };
            }
          });
        }
      }
      console.log(`Processed Device ${device.deviceno}:`, channels); // Debugging
      return {
        deviceNo: device.deviceno,
        channels
      };
    });
  };

  // Function to dynamically set colors based on percentage
  const getColor = (percentage) => {
    if (percentage < 50) return '#f94144';  // Red for < 50%
    if (percentage < 75) return '#f8961e';  // Orange for 50-74%
    return '#43aa8b';                       // Green for 75% and above
  };

  // Fetch data on component mount
  useEffect(() => {
    console.log("Fetching data..."); // Debugging
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${URL}/shiftwise`);
      setShiftData(response.data.message);
      console.log("API Response:", response.data.message); // Debugging
      filterData(response.data.message);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  // Filter data based on selected date
  const filterData = (data) => {
    const today = dayjs().format('YY/MM/DD'); // Adjusted to match API format
    const yesterday = dayjs().subtract(1, 'day').format('YY/MM/DD');
    console.log("Today's Date:", today, "Yesterday's Date:", yesterday); // Debugging

    const todayFiltered = data.filter(item => item.currentdate === today);
    const yesterdayFiltered = data.filter(item => item.currentdate === yesterday);

    console.log("Today Filtered Data:", todayFiltered); // Debugging
    console.log("Yesterday Filtered Data:", yesterdayFiltered); // Debugging

    setTodayData(processShiftData(todayFiltered));
    setYesterdayData(processShiftData(yesterdayFiltered));
  };

  // Handle opening the modal
  const showModal = (machineNumber, channel, shift, percentage) => {
    console.log(`Opening Modal for Machine: ${machineNumber}, Channel: ${channel}, Shift: ${shift}, Percentage: ${percentage}`); // Debugging
    setSelectedMachine({ machineNumber, channel, shift, percentage });
    setIsModalVisible(true);
  };

  // Handle closing the modal
  const handleOk = () => {
    console.log("Closing modal..."); // Debugging
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    console.log("Canceling modal..."); // Debugging
    setIsModalVisible(false);
  };

  // Determine which data to display based on selectedDate
  const dataToDisplay = selectedDate === 'today' ? todayData : yesterdayData;

  useEffect(()=>{
    console.log("selectedMachine",selectedMachine);
  },[selectedMachine])
  return (
    <div className="App">
      <div className="dashboard-container">

        {/* Main Content */}
        <div className="main-content">
          {/* Header */}
          <Header 
            selectedDate={selectedDate} 
            setSelectedDate={setSelectedDate}
            selectedShift={selectedShift}
            setSelectedShift={setSelectedShift}
          />


          {/* Progress Circles Section */}
          <div className="progress-section">
  {dataToDisplay?.map((device, deviceIndex) => (
    <div key={deviceIndex} className="device-section">
    <h2>Device {device.deviceNo}</h2>
      {Object.keys(device.channels).map(channelKey => (
        <div key={channelKey} className="channel-section">
          <h3>{channelKey.toUpperCase()}</h3>
          {['morning', 'evening'].map(shift => {
            const shiftData = device.channels[channelKey][shift];
            if (!shiftData) return null;

            // Only render the selected shift or all shifts if 'all' is selected
            if (selectedShift !== 'all' && shift !== selectedShift) return null;

            const [runPercentage, averagePercentage] = shiftData.percentages;

            return (
              <div
                key={shift}
                className="shift-section"
                onClick={() => showModal(device.deviceNo, channelKey, shift, runPercentage)}
              >
                <h4>{shift.charAt(0).toUpperCase() + shift.slice(1)} Shift</h4>
                <CircularProgress
                  size={150}
                  strokeWidth={10}
                  percentages={[runPercentage, averagePercentage]}
                  colors={["#f94144", "#f8961e", "#43aa8b"]}
                />
                <p>Shift Duration: {convertTimeToMinutes(shiftData.shift_time).toFixed(2)} hours</p>
                <p>Run Time: {shiftData.run_time} minutes ({runPercentage.toFixed(2)}%)</p>
                <p>Average: {shiftData.average} ({averagePercentage.toFixed(2)}%)</p>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  ))}
</div>


          {/* Bar Chart Section */}
          <div className="bar-chart-section">
           {shiftData && shiftData.length > 0 ? (
  <>
    {console.log("Passing shiftData to BarChartPlaceholder:", shiftData)} 
    <BarChartPlaceholder shiftwiseData={shiftData} />
  </>
) : (
  <p>No shift data available</p>
)}

          </div>
        </div>

 
     
      </div>
    </div>
  );
}

// Header Component
const Header = ({ selectedDate, setSelectedDate, selectedShift, setSelectedShift }) => {
  useEffect(() => {
    console.log("Selected Date:", selectedDate, "Selected Shift:", selectedShift); // Debugging
  }, [selectedDate, selectedShift]);

  return (
    <header className="dashboard-header">
      <h1>Welcome Back, Shiwansh</h1>
      <div className="header-controls">
        {/* Date Controls */}
        <div className="date-controls">
          <button 
            className={selectedDate === 'today' ? 'active' : ''} 
            onClick={() => setSelectedDate('today')}
          >
            Today
          </button>
          <button 
            className={selectedDate === 'yesterday' ? 'active' : ''} 
            onClick={() => setSelectedDate('yesterday')}
          >
            Yesterday
          </button>
        </div>

        {/* Shift Controls */}
        <div className="shift-controls">
          <button 
            className={selectedShift === 'morning' ? 'active' : ''} 
            onClick={() => setSelectedShift('morning')}
          >
            Morning
          </button>
          <button 
            className={selectedShift === 'evening' ? 'active' : ''} 
            onClick={() => setSelectedShift('evening')}
          >
            Evening
          </button>
          <button 
            className={selectedShift === 'all' ? 'active' : ''} 
            onClick={() => setSelectedShift('all')}
          >
            All Shifts
          </button>
        </div>
      </div>
    </header>
  );
};

export default App;