import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import React from 'react';

// 기본 Button 컴포넌트
const Button = ({ 
  primary = false, 
  size = 'medium', 
  label, 
  disabled = false,
  variant = 'default',
  ...props 
}: {
  primary?: boolean;
  size?: 'small' | 'medium' | 'large';
  label: string;
  disabled?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}) => {
  const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
  const variantClass = `storybook-button--${variant}`;
  const sizeClass = `storybook-button--${size}`;
  
  return React.createElement('button', {
    type: 'button',
    className: ['storybook-button', sizeClass, mode, variantClass].join(' '),
    disabled,
    ...props,
    style: {
      fontFamily: 'Nunito Sans, Helvetica Neue, Helvetica, Arial, sans-serif',
      fontWeight: 700,
      border: 0,
      borderRadius: '3em',
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'inline-block',
      lineHeight: 1,
      opacity: disabled ? 0.6 : 1,
      ...(primary && !disabled ? {
        color: '#fff',
        backgroundColor: '#1ea7fd',
      } : {
        color: '#333',
        backgroundColor: 'transparent',
        boxShadow: 'rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset',
      }),
      ...(size === 'small' ? {
        fontSize: '12px',
        padding: '10px 16px',
      } : size === 'large' ? {
        fontSize: '16px',
        padding: '12px 24px',
      } : {
        fontSize: '14px',
        padding: '11px 20px',
      }),
      ...(variant === 'success' && {
        backgroundColor: primary ? '#28a745' : '#28a745',
        color: '#fff',
        boxShadow: 'none',
      }),
      ...(variant === 'warning' && {
        backgroundColor: primary ? '#ffc107' : '#ffc107',
        color: '#212529',
        boxShadow: 'none',
      }),
      ...(variant === 'danger' && {
        backgroundColor: primary ? '#dc3545' : '#dc3545',
        color: '#fff',
        boxShadow: 'none',
      }),
    }
  }, label);
};

const meta: Meta<typeof Button> = {
  title: 'Example/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'success', 'warning', 'danger'],
    },
  },
  args: { onClick: fn() },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Button',
  },
};

export const Success: Story = {
  args: {
    primary: true,
    variant: 'success',
    label: 'Success Button',
  },
};

export const Warning: Story = {
  args: {
    primary: true,
    variant: 'warning',
    label: 'Warning Button',
  },
};

export const Danger: Story = {
  args: {
    primary: true,
    variant: 'danger',
    label: 'Danger Button',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    label: 'Button',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    label: 'Button',
  },
};

export const Disabled: Story = {
  args: {
    primary: true,
    disabled: true,
    label: 'Disabled Button',
  },
};

// 버튼 그룹 스토리
export const ButtonGroup: Story = {
  render: () => React.createElement('div', {
    style: { display: 'flex', gap: '10px', alignItems: 'center' }
  }, [
    React.createElement(Button, { key: 1, primary: true, label: 'Primary' }),
    React.createElement(Button, { key: 2, label: 'Secondary' }),
    React.createElement(Button, { key: 3, variant: 'success', primary: true, label: 'Success' }),
    React.createElement(Button, { key: 4, variant: 'danger', primary: true, label: 'Danger' }),
  ]),
  parameters: {
    docs: {
      description: {
        story: 'Multiple buttons can be grouped together to show different states and variants.',
      },
    },
  },
};

// 반응형 버튼 그룹
export const ResponsiveButtonGroup: Story = {
  render: () => React.createElement('div', {
    style: { 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '10px',
      maxWidth: '600px'
    }
  }, [
    React.createElement(Button, { key: 1, primary: true, size: 'small', label: 'Small' }),
    React.createElement(Button, { key: 2, primary: true, size: 'medium', label: 'Medium' }),
    React.createElement(Button, { key: 3, primary: true, size: 'large', label: 'Large' }),
    React.createElement(Button, { key: 4, variant: 'success', primary: true, label: 'Success' }),
    React.createElement(Button, { key: 5, variant: 'warning', primary: true, label: 'Warning' }),
    React.createElement(Button, { key: 6, variant: 'danger', primary: true, label: 'Danger' }),
  ]),
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
  },
};