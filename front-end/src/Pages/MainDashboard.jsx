import React from 'react';
import IconNavigate from '../Components/reusable_components/IconNavigate';
import { ModeOfTravel, Groups, BookmarkBorder } from '@mui/icons-material';

const MainDashboard = () => {
  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center"
      style={{
        background: `
          radial-gradient(circle at 20% 30%, #e0f7fa, transparent 60%),
          radial-gradient(circle at 80% 40%, #ede7f6, transparent 70%),
          radial-gradient(circle at 50% 80%, #fce4ec, transparent 60%)`,
        backgroundColor: '#f8fafc',
      }}
    >
      <div className="flex flex-col items-center justify-center w-full h-[80%] p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight drop-shadow-sm">
            DepEd Camarines Norte
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mt-2">
            For monitoring travels, managing appointments, and supporting SDS oversight.
          </p>
        </div>

        <div className="flex gap-6">
          <IconNavigate
            icon={<ModeOfTravel />}
            text="Travels"
            to="/travelsDashboard"
            color="blue"
          />
          <IconNavigate
            icon={<Groups />}
            text="Appointments"
            to="/appointmentDetails"
            color="black"
          />
           <IconNavigate
            icon={<BookmarkBorder />}
            text="Orders"
            to="/orderDashboard"
            color="green"
          />
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
