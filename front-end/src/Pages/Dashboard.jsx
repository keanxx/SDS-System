import React, { useState } from 'react';
import { TextField, InputAdornment, AppBar, Toolbar, Typography, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Icon from '../Components/Icon';
import { BarChart, ModeOfTravel } from '@mui/icons-material';
import Overview from '../Components/Overview';
import Navigator from '../Components/Navigator';
import CustomTable from '../Components/CustomTable';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
  const navigate = useNavigate();
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
      <div className="flex flex-grow w-full items-start justify-around gap-5 mt-5 px-8">
        

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