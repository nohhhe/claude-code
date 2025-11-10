import React, { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    loading = false,
    leftIcon,
    rightIcon,
    children,
    className = '',
    disabled,
    ...props
  }, ref) => {
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      border: 'none',
      borderRadius: '0.375rem',
      fontFamily: 'inherit',
      fontWeight: '500',
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease-in-out',
      outline: 'none',
      position: 'relative' as const,
      textDecoration: 'none',
      userSelect: 'none' as const,
      width: fullWidth ? '100%' : 'auto',
      opacity: disabled || loading ? 0.6 : 1,
    };

    const variantStyles = {
      primary: {
        backgroundColor: '#3b82f6',
        color: 'white',
        border: '2px solid #3b82f6',
      },
      secondary: {
        backgroundColor: '#f3f4f6',
        color: '#374151',
        border: '2px solid #d1d5db',
      },
      danger: {
        backgroundColor: '#ef4444',
        color: 'white',
        border: '2px solid #ef4444',
      },
      ghost: {
        backgroundColor: 'transparent',
        color: '#374151',
        border: '2px solid transparent',
      },
    };

    const sizeStyles = {
      small: {
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
        minHeight: '2rem',
      },
      medium: {
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        minHeight: '2.5rem',
      },
      large: {
        padding: '1rem 2rem',
        fontSize: '1.125rem',
        minHeight: '3rem',
      },
    };

    const hoverStyles = {
      primary: {
        backgroundColor: '#2563eb',
        borderColor: '#2563eb',
      },
      secondary: {
        backgroundColor: '#e5e7eb',
        borderColor: '#9ca3af',
      },
      danger: {
        backgroundColor: '#dc2626',
        borderColor: '#dc2626',
      },
      ghost: {
        backgroundColor: '#f9fafb',
        borderColor: '#e5e7eb',
      },
    };

    const focusStyles = {
      outline: '2px solid #3b82f6',
      outlineOffset: '2px',
    };

    const combinedStyles = {
      ...baseStyles,
      ...variantStyles[variant],
      ...sizeStyles[size],
    };

    const LoadingSpinner = () => (
      <svg
        className="animate-spin"
        style={{
          width: '1rem',
          height: '1rem',
          animation: 'spin 1s linear infinite',
        }}
        viewBox="0 0 24 24"
      >
        <circle
          style={{
            opacity: 0.25,
            stroke: 'currentColor',
            strokeWidth: 4,
            fill: 'none',
          }}
          cx="12"
          cy="12"
          r="10"
        />
        <path
          style={{
            opacity: 0.75,
            fill: 'currentColor',
          }}
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    return (
      <button
        ref={ref}
        style={combinedStyles}
        className={className}
        disabled={disabled || loading}
        onMouseEnter={(e) => {
          if (!disabled && !loading) {
            Object.assign(e.currentTarget.style, hoverStyles[variant]);
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !loading) {
            Object.assign(e.currentTarget.style, variantStyles[variant]);
          }
        }}
        onFocus={(e) => {
          if (!disabled && !loading) {
            Object.assign(e.currentTarget.style, focusStyles);
          }
        }}
        onBlur={(e) => {
          Object.assign(e.currentTarget.style, { outline: 'none' });
        }}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner />
            Loading...
          </>
        ) : (
          <>
            {leftIcon && <span>{leftIcon}</span>}
            {children}
            {rightIcon && <span>{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;