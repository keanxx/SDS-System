import React, { useState } from 'react';
import LineGraph from '../Components/LineGraph';
import Overview from '../Components/Overview';
import Pie from '../Components/Pie';
import Icon from '../Components/Icon';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Statistics = () => {
  const [selectedPosition, setSelectedPosition] = useState('All');
  const [selectedStation, setSelectedStation] = useState('All');
  const navigate = useNavigate();

  return (
    <>
      <div className="w-full min-h-screen max-h-full flex flex-col justify-center gap-5 bg-white">
        {/* Header Section */}
        <AppBar position="static"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#1e293b' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Travel List
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')}>Dashboard</Button>
          <Button color="inherit" onClick={() => navigate('/travels')}>Travels</Button>
          <Button color="inherit" onClick={() => navigate('/statistics')}>Statistics</Button>
        </Toolbar>
      </AppBar>
       

        {/* Main Content */}
        <div className="flex justify-center gap-5 px-5">
         
          <div className="flex bg-white/50 backdrop-blur-md border-green-500/30 border rounded-lg justify-center space-x-5 p-5 w-full h-auto">
            <div className="flex-col space-y-5">
              <div>
                <Overview />
              </div>
              <div className="flex gap-5">
                <LineGraph selectedPosition={selectedPosition} selectedStation={selectedStation} />
                <Pie />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Statistics;