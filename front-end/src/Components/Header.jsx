import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = ({ icon, imgSrc, text, navLinks = [] }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current path

  const handleNavigation = (path) => {
    navigate(path); // Navigate to the specified path
  };

  return (
    <div className="w-full h-auto flex items-center justify-between py-4 px-6 bg-white shadow-md z-10">
      {/* Left Section: Icon/Image and Text */}
      <div className="flex items-center space-x-4">
        {icon && <div className="text-3xl text-blue-500">{icon}</div>}
        {imgSrc && <img src={imgSrc} alt="header-icon" className="w-12 h-12 object-contain" />}
        <h1 className="text-2xl font-bold text-gray-800">{text}</h1>
      </div>

      {/* Right Section: Navigation Links */}
      <div className="flex items-center space-x-4">
        {navLinks.map((link, idx) => (
          <button
            key={idx}
            onClick={() => handleNavigation(link.path)}
            className={`font-medium border border-gray-300 rounded-md px-5 py-1 ${
              location.pathname === link.path ? 'text-blue-500' : 'text-black hover:text-blue-700'
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Header;