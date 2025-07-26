import React from 'react';
import { useNavigate } from 'react-router-dom';

const IconNavigate = ({ icon, text, to, color = 'black' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to); // Navigate to the specified path
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col min-w-[150px] items-center cursor-pointer p-4 rounded-lg border border-gray-300 transition-transform transform hover:scale-105"
      style={{
       
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Transparent white
        backdropFilter: 'blur(10px)', // Blur effect
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', // Subtle shadow
        border: '1px solid rgba(255, 255, 255, 0.3)', // Transparent border
      }}
    >
      <div className={`text-${color}-500 text-2xl`}>{icon}</div>
      <span className={`font-bold text-lg text-500`}>{text}</span>
    </div>
  );
};

export default IconNavigate;