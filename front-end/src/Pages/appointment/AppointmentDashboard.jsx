import React, { useState } from 'react';
import AppointmentTable from '../../Components/appointment_components/AppointmentTable';
import Header from '../../Components/Header';

const AppointmentDetails = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { label: 'Dashboard', path: '/' },
    { label: 'Appointments', path: '/appointmentDetails' },
    { label: 'Statistics', path: '/appointmentStatistics' },
  ];

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-full">
        <Header
          icon={<img src="/appointmentLogo.jpg" alt="logo" className="w-12 h-12 object-contain" />}
          text="Appointment | List"
          navLinks={navLinks}
        />
      </div>
      <div className="w-full h-full bg-white shadow-lg rounded-lg  overflow-y-auto">
        <AppointmentTable searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
    </div>
  );
};

export default AppointmentDetails;