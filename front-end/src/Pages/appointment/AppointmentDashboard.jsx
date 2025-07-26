import React, { useState } from 'react';
import AppointmentTable from '../../Components/appointment_components/AppointmentTable';
import Header from '../../Components/Header';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AppointmentDetails = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const navLinks = [
    { label: 'Dashboard', path: '/' },
    { label: 'Appointments', path: '/appointmentDetails' },
    { label: 'Statistics', path: '/appointmentStatistics' },
  ];

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
       <AppBar position="static"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#1e293b' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
           Appointments List
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')}>Dashboard</Button>
          <Button color="inherit" onClick={() => navigate('/appointmentDetails')}>Appointments</Button>
          <Button color="inherit" onClick={() => navigate('/appointmentStatistics')}>Statistics</Button>
        </Toolbar>
      </AppBar>
      <div className="w-full h-full bg-white shadow-lg rounded-lg  overflow-y-auto">
        <AppointmentTable searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
    </div>
  );
};

export default AppointmentDetails;