import React from 'react';

const LoadingSpinner = ({ size = 40, message = "Loading..." }) => {
  return (
    <div className="loading">
      <div 
        className="spinner" 
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          border: `4px solid rgba(0, 212, 255, 0.1)`,
          borderLeft: `4px solid #00d4ff`
        }}
      ></div>
      {message && <p style={{ marginTop: '1rem', color: '#b0b0b0' }}>{message}</p>}
    </div>
  );
};

export default LoadingSpinner;