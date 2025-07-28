import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TravelDetails from '../Components/TravelDetails';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Travels = () => {

  const navigate = useNavigate();

  return (
    <>
      <main className="w-full min-h-screen flex flex-col bg-white">
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
        <div className="flex  justify-center gap-3 mt-3 px-5">
          {/* Sidebar */}
          

          {/* Content Section */}
          <div className="flex-grow min-w-[1000px] w-full">
            <section className="bg-white/50 backdrop-blur-md border-green-500/30 border rounded-lg ">
              <div className="w-full">
                <TravelDetails/>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default Travels;