import React from 'react';
import { useNavigate } from 'react-router-dom';

const Icon = ({ 
  icon, 
  text, 
  to, 
  onClick,
  className = '',
  activeClassName = '',
  isActive = false,
  iconColor = 'text-gray-600', // Default color
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    
    if (to) {
      navigate(to);
    }
  };

  return (
    <div 
      className={`flex bg-white shadow-md items-center gap-3 cursor-pointer px-4 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 ${className} ${isActive ? activeClassName : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      {/* Icon component with color */}
      <div className={`${iconColor}`}>
        {icon}
      </div>
      
      {/* Text */}
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
};

export default Icon;