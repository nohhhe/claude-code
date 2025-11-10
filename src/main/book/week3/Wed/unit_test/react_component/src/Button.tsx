import React from 'react';

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

function Button({ onClick, disabled, loading, children }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={loading ? 'loading' : ''}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}

export default Button;