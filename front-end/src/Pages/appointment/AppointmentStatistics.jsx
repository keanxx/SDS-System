import React from 'react';
import LineGraphAppointment from '../../Components/appointment_components/LineGraphAppointment';
import OverviewAppointment from '../../Components/appointment_components/OverviewAppointment';
import BarGraphAppointment from '../../Components/appointment_components/BarGraphAppoinment';
import PieChartAppointment from '../../Components/appointment_components/PieChartAppointment';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AppointmentStatistics = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full  flex flex-col bg-white">
      {/* Header Section */}
     <AppBar position="static"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#1e293b' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
           Appointments Statistics
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')}>Dashboard</Button>
          <Button color="inherit" onClick={() => navigate('/appointmentDetails')}>Appointments</Button>
          <Button color="inherit" onClick={() => navigate('/appointmentStatistics')}>Statistics</Button>
        </Toolbar>
      </AppBar>
      {/* Content Section */}
      <div className="flex flex-col w-full  flex-grow p-3 ">
        {/* Overview Section */}
        <div className="w-full items-center flex justify-start px-10  ">
          <OverviewAppointment />
          
        </div>

      <div className='flex gap-5 justify-center flex-wrap w-full'>
       {/* Line Graph Section */}
        <div className="w-full max-w-[800px] md:max-w-[700px] sm:max-w-[500px]">
          <LineGraphAppointment />
        </div>

        {/* bar */}
        <div className="w-full max-w-[800px] md:max-w-[700px] sm:max-w-[500px]">
            <BarGraphAppointment />
        </div>
      </div>
       
      </div>
    </div>
  );
};

export default AppointmentStatistics;