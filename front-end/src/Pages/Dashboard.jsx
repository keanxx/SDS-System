import React, { useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Icon from '../Components/Icon';
import { BarChart, ModeOfTravel } from '@mui/icons-material';
import Overview from '../Components/Overview';
import Navigator from '../Components/Navigator';
import CustomTable from '../Components/CustomTable';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <main className="w-full h-screen flex flex-col bg-white bg-cover bg-center">
      {/* Background Logo */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
        <img src="/depEdCNLogo.png" alt="depEd" className="w-[500px] h-auto opacity-20" />
      </div>

      {/* Header Section */}
      <div className="py-5 px-8 flex items-center w-full justify-start bg-white shadow-md z-10">
        <div className="flex items-center gap-4 px-5">
          <img src="/travelOrderLogo.png" alt="logo" className="w-28 h-auto" />
          <h1 className="text-3xl font-bold text-[#0f2b66]">Travel Order</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-grow w-full items-start justify-around gap-5 mt-5 px-8">
        {/* Sidebar */}
        <div className="flex flex-col justify-center space-y-5">
          <Icon
            icon={<ModeOfTravel fontSize="large" />}
            text="Travels"
            to="/travels"
            iconColor="text-green-500"
          />
          <Icon
            icon={<BarChart fontSize="large" />}
            text="Statistics"
            to="/statistics"
            iconColor="text-blue-500"
          />
        </div>

        {/* Main Section */}
        <section className="flex-grow h-full  backdrop-blur-md border-black/ border rounded-lg items-center space-y-5 flex flex-col px-8 ">
          <div className="w-full">
            <Navigator />
          </div>

          <div className="w-full">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  '&:hover': {
                    backgroundColor: '#f8f9fa'
                  },
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }
              }}
            />
          </div>
          
          {searchQuery && (
          <div className="w-full flex items-center justify-center">
            <CustomTable searchQuery={searchQuery} />
          </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Dashboard;