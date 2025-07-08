import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TravelDetails from '../Components/TravelDetails';
import Header from '../Components/Header';
import Icon from '../Components/Icon';
import { BarChart, ModeOfTravel, SpaceDashboard } from '@mui/icons-material';

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
        <div className="py-5 px-8 flex items-center w-full justify-between bg-white shadow-md z-10">
          <div className="flex items-center gap-4 px-5">
            <img src="/travelOrderLogo.png" alt="logo" className="w-28 h-auto" />
            <h1 className="text-3xl font-bold text-[#0f2b66]">Travel Order | Travels</h1>
          </div>

          <div className="flex gap-5 items-center">
            <Icon
              icon={<SpaceDashboard fontSize="large" />}
              text="Dashboard"
              to="/"
              iconColor="text-green-500"
            /><Icon
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
        </div>

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