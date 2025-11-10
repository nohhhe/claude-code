import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// Card 컴포넌트
const Card = ({ 
  title,
  description,
  image,
  variant = 'default',
  hasAction = false,
  actionLabel = '액션',
  disabled = false,
  ...props 
}: {
  title: string;
  description: string;
  image?: string;
  variant?: 'default' | 'hover' | 'selected' | 'disabled';
  hasAction?: boolean;
  actionLabel?: string;
  disabled?: boolean;
}) => {
  const baseStyles: React.CSSProperties = {
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #e1e5e9',
    backgroundColor: '#fff',
    transition: 'all 0.2s ease',
    fontFamily: 'system-ui, sans-serif',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {},
    hover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    },
    selected: {
      backgroundColor: '#e3f2fd',
      borderColor: '#2196f3',
    },
    disabled: {
      backgroundColor: '#f5f5f5',
      color: '#999',
      opacity: 0.6,
    },
  };

  const cardStyles = { ...baseStyles, ...variantStyles[variant] };

  return React.createElement('div', {
    style: { ...cardStyles, width: '280px' },
    ...props
  }, [
    image && React.createElement('div', {
      key: 'image',
      style: {
        height: '150px',
        marginBottom: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#6c757d'
      }
    }, title[0]),
    React.createElement('div', { key: 'content' }, [
      React.createElement('h3', {
        key: 'title',
        style: { margin: '0 0 0.5rem 0', color: '#2c3e50' }
      }, title),
      React.createElement('p', {
        key: 'description',
        style: { margin: '0 0 1rem 0', color: '#666', fontSize: '0.9rem' }
      }, description),
      hasAction && React.createElement('button', {
        key: 'action',
        disabled: disabled || variant === 'disabled',
        style: {
          width: '100%',
          padding: '0.75rem',
          backgroundColor: disabled || variant === 'disabled' ? '#ccc' : '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: disabled || variant === 'disabled' ? 'not-allowed' : 'pointer',
        }
      }, actionLabel)
    ])
  ]);
};

const meta: Meta<typeof Card> = {
  title: 'Example/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'hover', 'selected', 'disabled'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: '스마트폰',
    description: '최신 기술이 적용된 고성능 스마트폰입니다.',
    image: 'placeholder',
    hasAction: true,
    actionLabel: '장바구니 담기'
  },
};

export const WithoutAction: Story = {
  args: {
    title: '노트북',
    description: '업무와 게임에 최적화된 고성능 노트북입니다.',
    image: 'placeholder',
    hasAction: false,
  },
};

export const HoverState: Story = {
  args: {
    title: '헤드폰',
    description: '노이즈 캔슬링 기능이 탑재된 프리미엄 헤드폰입니다.',
    image: 'placeholder',
    variant: 'hover',
    hasAction: true,
  },
};

export const Selected: Story = {
  args: {
    title: '키보드',
    description: '기계식 스위치를 사용한 게이밍 키보드입니다.',
    image: 'placeholder',
    variant: 'selected',
    hasAction: true,
  },
};

export const Disabled: Story = {
  args: {
    title: '마우스',
    description: '무선 게이밍 마우스 (품절)',
    image: 'placeholder',
    variant: 'disabled',
    hasAction: true,
    actionLabel: '품절',
    disabled: true,
  },
};

export const WithoutImage: Story = {
  args: {
    title: '모니터',
    description: '4K UHD 해상도를 지원하는 대형 모니터입니다.',
    hasAction: true,
  },
};

// 카드 그리드
export const CardGrid: Story = {
  render: () => React.createElement('div', {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.5rem',
      maxWidth: '900px',
    }
  }, [
    React.createElement(Card, {
      key: 1,
      title: '스마트폰',
      description: '최신 기술이 적용된 스마트폰',
      image: 'placeholder',
      hasAction: true,
    }),
    React.createElement(Card, {
      key: 2,
      title: '노트북',
      description: '고성능 게이밍 노트북',
      image: 'placeholder',
      variant: 'hover',
      hasAction: true,
    }),
    React.createElement(Card, {
      key: 3,
      title: '헤드폰',
      description: '노이즈 캔슬링 헤드폰',
      image: 'placeholder',
      variant: 'selected',
      hasAction: true,
    }),
    React.createElement(Card, {
      key: 4,
      title: '키보드',
      description: '기계식 게이밍 키보드 (품절)',
      image: 'placeholder',
      variant: 'disabled',
      hasAction: true,
      actionLabel: '품절',
      disabled: true,
    }),
  ]),
  parameters: {
    docs: {
      description: {
        story: 'Cards can be arranged in a responsive grid layout.',
      },
    },
  },
};

// 모바일 카드 스택
export const MobileCardStack: Story = {
  render: () => React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      maxWidth: '320px',
    }
  }, [
    React.createElement(Card, {
      key: 1,
      title: '스마트폰',
      description: '최신 기술이 적용된 스마트폰',
      hasAction: true,
    }),
    React.createElement(Card, {
      key: 2,
      title: '노트북',
      description: '고성능 게이밍 노트북',
      hasAction: true,
    }),
    React.createElement(Card, {
      key: 3,
      title: '헤드폰',
      description: '노이즈 캔슬링 헤드폰',
      hasAction: true,
    }),
  ]),
  parameters: {
    viewport: {
      defaultViewport: 'mobile',
    },
  },
};