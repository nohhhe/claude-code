import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HealthCheck from '../../src/components/HealthCheck';

describe('HealthCheck', () => {
  it('renders healthy status correctly', () => {
    render(<HealthCheck status="healthy" />);
    expect(screen.getByText('Healthy')).toBeInTheDocument();
    expect(screen.getByText('✅')).toBeInTheDocument();
  });

  it('renders warning status correctly', () => {
    render(<HealthCheck status="warning" />);
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });

  it('renders critical status correctly', () => {
    render(<HealthCheck status="critical" />);
    expect(screen.getByText('Critical')).toBeInTheDocument();
    expect(screen.getByText('❌')).toBeInTheDocument();
  });

  it('renders unknown status correctly', () => {
    render(<HealthCheck status="unknown" />);
    expect(screen.getByText('Unknown')).toBeInTheDocument();
    expect(screen.getByText('❓')).toBeInTheDocument();
  });

  it('renders with service name', () => {
    render(<HealthCheck status="healthy" service="API Server" />);
    expect(screen.getByText('API Server: Healthy')).toBeInTheDocument();
  });

  it('renders with message', () => {
    render(<HealthCheck status="warning" message="High memory usage" />);
    expect(screen.getByText('High memory usage')).toBeInTheDocument();
  });

  it('renders with service and message', () => {
    render(
      <HealthCheck 
        status="critical" 
        service="Database" 
        message="Connection timeout"
      />
    );
    expect(screen.getByText('Database: Critical')).toBeInTheDocument();
    expect(screen.getByText('Connection timeout')).toBeInTheDocument();
  });
});