import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TravelDetails from '../Components/TravelDetails';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Travels = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
  };

  const handleButton = () => {
    navigate('/admin');
  };

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
            <section className="bg-white/50 backdrop-blur-md border-green-500/30 border rounded-lg p-10">
              <form
                onSubmit={handleSearchSubmit}
                className="w-full max-w-[350px] min-w-[250px] flex flex-col mb-5"
              >
                <input
                  type="text"
                  placeholder="Search here..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full border border-gray-500/30 p-2 rounded"
                />
              </form>
              <div className="w-full">
                <TravelDetails searchQuery={searchQuery} />
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default Travels;