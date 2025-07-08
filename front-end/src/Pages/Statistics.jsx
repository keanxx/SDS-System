import React, { useState } from 'react';
import LineGraph from '../Components/LineGraph';
import Overview from '../Components/Overview';
import Pie from '../Components/Pie';
import Icon from '../Components/Icon';
import { BarChart, ModeOfTravel, SpaceDashboard } from '@mui/icons-material';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const Statistics = () => {
  const [selectedPosition, setSelectedPosition] = useState('All');
  const [selectedStation, setSelectedStation] = useState('All');

  return (
    <>
      <div className="w-full min-h-screen max-h-full flex flex-col justify-center gap-5 bg-white">
        {/* Header Section */}
        <div className="py-5 px-8 flex items-center w-full justify-start bg-white shadow-md z-10">
          <div className="flex items-center gap-4 px-5">
            <img src="/travelOrderLogo.png" alt="logo" className="w-28 h-auto" />
            <h1 className="text-3xl font-bold text-[#0f2b66]">Travel Order | Statistics</h1>
          </div>
        </div>

       

        {/* Main Content */}
        <div className="flex justify-center gap-5 px-5">
          <div className="flex flex-col space-y-5">
            <Icon
              icon={<SpaceDashboard fontSize="large" />}
              text="Dashboard"
              to="/"
              iconColor="text-green-500"
            />
            <Icon
              icon={<ModeOfTravel fontSize="large" />}
              text="Travels"
              to="/travels"
              iconColor="text-blue-500"
            />
          </div>
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