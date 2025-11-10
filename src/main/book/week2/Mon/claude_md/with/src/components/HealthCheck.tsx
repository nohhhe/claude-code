import React from 'react';

type HealthStatus = 'healthy' | 'warning' | 'critical' | 'unknown';

interface HealthCheckProps {
  status: HealthStatus;
  service?: string;
  message?: string;
}

const HealthCheck: React.FC<HealthCheckProps> = ({ status, service, message }) => {
  const getStatusIcon = (status: HealthStatus) => {
    switch (status) {
      case 'healthy':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'critical':
        return '❌';
      case 'unknown':
      default:
        return '❓';
    }
  };

  const getStatusColor = (status: HealthStatus) => {
    switch (status) {
      case 'healthy':
        return '#22c55e';
      case 'warning':
        return '#f59e0b';
      case 'critical':
        return '#ef4444';
      case 'unknown':
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: HealthStatus) => {
    switch (status) {
      case 'healthy':
        return 'Healthy';
      case 'warning':
        return 'Warning';
      case 'critical':
        return 'Critical';
      case 'unknown':
      default:
        return 'Unknown';
    }
  };

  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        padding: '12px',
        borderRadius: '8px',
        backgroundColor: '#f8fafc',
        border: `2px solid ${getStatusColor(status)}`,
        color: getStatusColor(status)
      }}
    >
      <span style={{ fontSize: '20px' }}>
        {getStatusIcon(status)}
      </span>
      <div>
        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
          {service ? `${service}: ` : ''}{getStatusText(status)}
        </div>
        {message && (
          <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthCheck;