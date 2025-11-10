import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

// Modal 컴포넌트
const Modal = ({ 
  isOpen = true,
  type = 'default',
  title = 'Modal Title',
  children,
  onClose,
  ...props 
}: {
  isOpen?: boolean;
  type?: 'default' | 'confirm' | 'drawer';
  title?: string;
  children?: React.ReactNode;
  onClose?: () => void;
}) => {
  if (!isOpen) return null;

  const overlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  };

  const modalStyles: React.CSSProperties = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  };

  const drawerStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: '300px',
    backgroundColor: '#fff',
    boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
    zIndex: 1001,
    display: 'flex',
    flexDirection: 'column',
  };

  const confirmModalStyles: React.CSSProperties = {
    ...modalStyles,
    maxWidth: '400px',
    textAlign: 'center' as const,
  };

  if (type === 'drawer') {
    return React.createElement('div', {}, [
      React.createElement('div', {
        key: 'overlay',
        style: { ...overlayStyles, justifyContent: 'flex-end', alignItems: 'stretch', padding: 0 },
        onClick: onClose,
      }),
      React.createElement('div', {
        key: 'drawer',
        style: drawerStyles,
        onClick: (e: React.MouseEvent) => e.stopPropagation(),
      }, [
        React.createElement('div', {
          key: 'header',
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.5rem',
            borderBottom: '1px solid #e9ecef',
          }
        }, [
          React.createElement('h3', { 
            key: 'title', 
            style: { margin: 0, color: '#2c3e50' } 
          }, title),
          React.createElement('button', {
            key: 'close',
            onClick: onClose,
            style: {
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#666',
            }
          }, '✕')
        ]),
        React.createElement('div', {
          key: 'content',
          style: { flex: 1, padding: '1.5rem', overflowY: 'auto' }
        }, children)
      ])
    ]);
  }

  return React.createElement('div', {
    style: overlayStyles,
    onClick: onClose,
    ...props
  }, 
    React.createElement('div', {
      style: type === 'confirm' ? confirmModalStyles : modalStyles,
      onClick: (e: React.MouseEvent) => e.stopPropagation(),
    }, [
      type !== 'confirm' && React.createElement('div', {
        key: 'header',
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem',
          borderBottom: '1px solid #e9ecef',
        }
      }, [
        React.createElement('h3', { 
          key: 'title', 
          style: { margin: 0, color: '#2c3e50' } 
        }, title),
        React.createElement('button', {
          key: 'close',
          onClick: onClose,
          style: {
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#666',
          }
        }, '✕')
      ]),
      React.createElement('div', {
        key: 'body',
        style: { padding: type === 'confirm' ? '2rem' : '1.5rem' }
      }, children),
      type !== 'confirm' && React.createElement('div', {
        key: 'footer',
        style: {
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '1rem',
          padding: '1.5rem',
          borderTop: '1px solid #e9ecef',
          backgroundColor: '#f8f9fa',
        }
      }, [
        React.createElement('button', {
          key: 'cancel',
          onClick: onClose,
          style: {
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6c757d',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }
        }, '취소'),
        React.createElement('button', {
          key: 'confirm',
          style: {
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }
        }, '확인'),
      ])
    ])
  );
};

// Interactive Modal wrapper for Storybook
const InteractiveModal = (props: any) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return React.createElement('div', {}, [
    React.createElement('button', {
      key: 'trigger',
      onClick: () => setIsOpen(true),
      style: {
        padding: '0.75rem 1.5rem',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontWeight: 'bold',
        cursor: 'pointer',
      }
    }, `Open ${props.type || 'Default'} Modal`),
    React.createElement(Modal, {
      key: 'modal',
      ...props,
      isOpen,
      onClose: () => setIsOpen(false),
    })
  ]);
};

const meta: Meta<typeof Modal> = {
  title: 'Example/Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['default', 'confirm', 'drawer'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: '기본 모달',
    children: React.createElement('div', {}, [
      React.createElement('p', { key: 1 }, '이것은 기본 모달의 내용입니다.'),
      React.createElement('p', { key: 2 }, '모달 안에 다양한 컨텐츠를 넣을 수 있습니다.'),
      React.createElement('div', {
        key: 3,
        style: { marginTop: '1rem' }
      }, [
        React.createElement('input', {
          key: 1,
          type: 'text',
          placeholder: '이름을 입력하세요',
          style: {
            width: '100%',
            padding: '0.75rem',
            marginBottom: '1rem',
            border: '1px solid #ced4da',
            borderRadius: '4px',
          }
        }),
        React.createElement('input', {
          key: 2,
          type: 'email',
          placeholder: '이메일을 입력하세요',
          style: {
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #ced4da',
            borderRadius: '4px',
          }
        }),
      ])
    ]),
  },
};

export const ConfirmModal: Story = {
  args: {
    isOpen: true,
    type: 'confirm',
    children: React.createElement('div', {}, [
      React.createElement('div', {
        key: 'icon',
        style: { fontSize: '3rem', marginBottom: '1rem' }
      }, '⚠️'),
      React.createElement('h3', {
        key: 'title',
        style: { margin: '0 0 0.5rem 0', color: '#2c3e50' }
      }, '정말로 삭제하시겠습니까?'),
      React.createElement('p', {
        key: 'description',
        style: { margin: '0 0 2rem 0', color: '#666' }
      }, '이 작업은 되돌릴 수 없습니다.'),
      React.createElement('div', {
        key: 'buttons',
        style: { display: 'flex', gap: '1rem', justifyContent: 'center' }
      }, [
        React.createElement('button', {
          key: 'cancel',
          style: {
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6c757d',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }
        }, '취소'),
        React.createElement('button', {
          key: 'delete',
          style: {
            padding: '0.75rem 1.5rem',
            backgroundColor: '#dc3545',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }
        }, '삭제'),
      ])
    ]),
  },
};

export const Drawer: Story = {
  args: {
    isOpen: true,
    type: 'drawer',
    title: '사이드 드로어',
    children: React.createElement('div', {}, [
      React.createElement('nav', {
        key: 'menu',
        style: { marginBottom: '2rem' }
      }, [
        React.createElement('ul', {
          style: { listStyle: 'none', padding: 0, margin: 0 }
        }, [
          React.createElement('li', { 
            key: 1, 
            style: { marginBottom: '0.5rem' } 
          }, React.createElement('a', {
            href: '#',
            style: {
              display: 'block',
              padding: '0.75rem',
              textDecoration: 'none',
              color: '#2c3e50',
              borderRadius: '4px',
              transition: 'background-color 0.2s ease',
            }
          }, '메뉴 1')),
          React.createElement('li', { 
            key: 2, 
            style: { marginBottom: '0.5rem' } 
          }, React.createElement('a', {
            href: '#',
            style: {
              display: 'block',
              padding: '0.75rem',
              textDecoration: 'none',
              color: '#2c3e50',
              borderRadius: '4px',
              backgroundColor: '#f8f9fa',
            }
          }, '메뉴 2')),
          React.createElement('li', { 
            key: 3, 
            style: { marginBottom: '0.5rem' } 
          }, React.createElement('a', {
            href: '#',
            style: {
              display: 'block',
              padding: '0.75rem',
              textDecoration: 'none',
              color: '#2c3e50',
              borderRadius: '4px',
            }
          }, '메뉴 3')),
        ])
      ]),
      React.createElement('div', { key: 'settings' }, [
        React.createElement('h4', {
          key: 'title',
          style: { margin: '0 0 1rem 0', color: '#2c3e50' }
        }, '설정'),
        React.createElement('div', {
          key: 'options',
          style: { display: 'flex', flexDirection: 'column', gap: '0.75rem' }
        }, [
          React.createElement('label', {
            key: 1,
            style: { display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }
          }, [
            React.createElement('input', { key: 'input', type: 'checkbox' }),
            React.createElement('span', { key: 'text' }, '알림 활성화')
          ]),
          React.createElement('label', {
            key: 2,
            style: { display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }
          }, [
            React.createElement('input', { key: 'input', type: 'checkbox' }),
            React.createElement('span', { key: 'text' }, '다크 모드')
          ]),
          React.createElement('label', {
            key: 3,
            style: { display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }
          }, [
            React.createElement('input', { key: 'input', type: 'checkbox', defaultChecked: true }),
            React.createElement('span', { key: 'text' }, '자동 저장')
          ]),
        ])
      ])
    ]),
  },
};

// Interactive Stories
export const InteractiveDefault: Story = {
  render: () => React.createElement(InteractiveModal, {
    title: '대화형 기본 모달',
    children: React.createElement('p', {}, '버튼을 클릭해서 모달을 열어보세요!'),
  }),
  parameters: {
    docs: {
      description: {
        story: 'Click the button to open an interactive modal.',
      },
    },
  },
};

export const InteractiveConfirm: Story = {
  render: () => React.createElement(InteractiveModal, {
    type: 'confirm',
    children: React.createElement('div', { style: { textAlign: 'center' } }, [
      React.createElement('div', { key: 'icon', style: { fontSize: '3rem', marginBottom: '1rem' } }, '🗑️'),
      React.createElement('h3', { key: 'title', style: { margin: 0, color: '#2c3e50' } }, '항목을 삭제하시겠습니까?'),
      React.createElement('p', { key: 'desc', style: { margin: '0.5rem 0 2rem 0', color: '#666' } }, '이 작업은 취소할 수 없습니다.'),
    ]),
  }),
  parameters: {
    docs: {
      description: {
        story: 'Click the button to open an interactive confirmation modal.',
      },
    },
  },
};

export const InteractiveDrawer: Story = {
  render: () => React.createElement(InteractiveModal, {
    type: 'drawer',
    title: '대화형 드로어',
    children: React.createElement('p', {}, '사이드바 메뉴와 설정 옵션들이 여기에 표시됩니다.'),
  }),
  parameters: {
    docs: {
      description: {
        story: 'Click the button to open an interactive side drawer.',
      },
    },
  },
};