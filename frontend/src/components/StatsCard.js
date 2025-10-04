import React from 'react';

const StatsCard = ({ icon: Icon, title, value, subtitle, color = '#00d4ff', trend }) => {
  return (
    <div className="dashboard-card">
      <div className="card-header">
        <div className="card-icon" style={{ background: `linear-gradient(135deg, ${color}, ${color}80)` }}>
          <Icon size={24} />
        </div>
        <div>
          <div className="card-title">{title}</div>
          {subtitle && <div style={{ color: color, fontSize: '0.875rem' }}>{subtitle}</div>}
        </div>
      </div>
      <div className="card-content">
        <div style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: color, 
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {value}
          {trend && (
            <span style={{ 
              fontSize: '0.875rem', 
              color: trend > 0 ? '#00ff88' : '#ff6b6b',
              display: 'flex',
              alignItems: 'center'
            }}>
              {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;