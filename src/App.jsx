import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './Pages/DashBoard';
import MWReport from './Pages/MWReport';
import OperatorEntry from './Pages/OperatorEntry';
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import OperatorList from './Pages/OperatorList';
import MasterMachine from './Pages/MasterMachine';
import Machinethreshold from './Pages/Machinethreshold';
import './App.css'; // Import your CSS for styling
import Operator from './Pages/Operators';
import DataEntryshow from './Pages/dataEntryshow';
import BreakDataEntry from './Pages/BreakDataEntry';
import Reasons from './Pages/Reasons';
import ResonsStoppage from './Pages/ResonsStoppage';
import image from '../src/Assests/unnamed.jpg'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import ReportIcon from '@mui/icons-material/Report';
import ComputerIcon from '@mui/icons-material/Computer';
import DangerousRoundedIcon from '@mui/icons-material/DangerousRounded';
// Sidebar component
const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const location = useLocation(); // Get the current location
  
  const handleMenuClick = (menu) => {
    // Toggle submenu visibility
    if (activeMenu === menu) {
      setActiveMenu(null); // Close if already open
    } else {
      setActiveMenu(menu); // Open the clicked menu
    }
  };

  return (
    <div className="sidebar">
      <h4 style={{marginBottom:"30px"}}>
      <img src={image} style={{width :'100%',height:'100px'}}/>
      </h4>
      <ul>
        <li>
          <div onClick={() => handleMenuClick('home')}>
            <Link to="/Dashboard" className={location.pathname === '/Dashboard' ? 'active' : ''}><HomeOutlinedIcon style={{width :'20px',height:'20px'}}/> Home</Link>
          </div>
        </li>
        <li>
          <div onClick={() => handleMenuClick('dataEntry')}>
            <Link to="/dataEntry" className={location.pathname === '/dataEntry' ? 'active' : ''}> <PostAddOutlinedIcon style={{width :'20px',height:'20px'}}/> Data Entry</Link>
          </div>
          {activeMenu === 'dataEntry' && (
            <ul className="submenu">
              <li><Link to="/dataEntry" className={location.pathname === '/dataEntry' ? 'active' : ''}> <SettingsIcon style={{width :'20px',height:'20px'}}/> Operator</Link></li>
              <li><Link to="/dataEntry/break" className={location.pathname === '/dataEntry/break' ? 'active' : ''}>Break</Link></li>
            </ul>
          )}
        </li>

        <li>
          <div onClick={() => handleMenuClick('report')}>
            <Link to="/mwreport/" className={location.pathname === '/mwreport/' ? 'active' : ''}><ReportIcon style={{width :'20px',height:'20px'}}/> Report</Link>
          </div>
          {activeMenu === 'report' && (
            <ul className="submenu">
              <li><Link to="/mwreport/" className={location.pathname === '/mwreport/' ? 'active' : ''}><ComputerIcon style={{width :'20px',height:'20px'}}/> Machine</Link></li>
              <li><Link to="/mwreport/machine" className={location.pathname === '/mwreport/machine' ? 'active' : ''}><SettingsIcon style={{width :'20px',height:'20px'}}/> Operator</Link></li>
              <li><Link to="/mwreport/stoppage" className={location.pathname === '/mwreport/stoppage' ? 'active' : ''}><DangerousRoundedIcon style={{width :'20px',height:'20px'}}/> Stoppage</Link></li>
            </ul>
          )}
        </li>

        <li>
          <div onClick={() => handleMenuClick('master')}>
            <Link to="/master" className={location.pathname === '/master' ? 'active' : ''}> <SettingsIcon style={{width :'20px',height:'20px'}}/> Master</Link>
          </div>
          {activeMenu === 'master' && (
            <ul className="submenu">
              <li><Link to="/master/machine" className={location.pathname === '/master/machine' ? 'active' : ''}><ComputerIcon style={{width :'20px',height:'20px'}}/> Machine</Link></li>
              <li><Link to="/master/Operator" className={location.pathname === '/master/Operator' ? 'active' : ''}> <SettingsIcon style={{width :'20px',height:'20px', gap:'2px'}}/> Operator</Link></li>
              <li><Link to="/master/Reasons" className={location.pathname === '/master/Reasons' ? 'active' : ''}><DangerousRoundedIcon style={{width :'20px',height:'20px'}}/> Reasons</Link></li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

// Main App component
const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

// AppContent component to use useLocation hook
const AppContent = () => {
  const location = useLocation();
  const noSidebarRoutes = ['/', '/signup']; // Routes where Sidebar should not appear
  const showSidebar = !noSidebarRoutes.includes(location.pathname);

  return (
    <div className="app-container">
      {showSidebar && <Sidebar />}  {/* Conditionally render Sidebar */}
      <div className="content">
        <Routes>
          <Route path="/" element={<Login />} /> {/* Login route */}
          <Route path="/signup" element={<Signup />} />  {/* Signup route */}
          <Route path="/Dashboard" element={<Dashboard />} /> {/* Dashboard path */}
          <Route path="/dataEntry" element={<OperatorEntry />} /> {/* Data Entry path */}
          <Route path="/dataEntry/break" element={<BreakDataEntry />} />
          <Route path="/mwreport" element={<MWReport />} /> {/* MWReport path */}
          <Route path="/mwreport/stoppage" element={<ResonsStoppage />} /> {/* MWReport path */}
          <Route path="/master" element={<OperatorList/>} /> {/* Placeholder for Master path */}
          <Route path="/mwreport/machine" element={<DataEntryshow/>} /> {/* Placeholder for Master Machine*/}
          <Route path="/master/machine" element={<Machinethreshold/>} /> {/* Placeholder for Master Machine*/}
          <Route path="/master/Operator" element={<Operator/>} /> {/* Placeholder for Master Machine*/}
          <Route path="/master/Reasons" element={<Reasons/>} /> 
          </Routes>
      </div>
    </div>
  );
};

export default App;
