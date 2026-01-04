import React from 'react';
import type { Preview } from '@storybook/react';
import '../styles/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Viewport 설정
    viewport: {
      viewports: {
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1280px',
            height: '720px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        mobile: {
          name: 'Mobile',
          styles: {
            width: '390px',
            height: '844px',
          },
        },
      },
    },
    // Chromatic 설정
    chromatic: {
      // 모든 스토리에 대해 반응형 스냅샷 캡처
      viewports: [390, 768, 1280],
      // 애니메이션 완료 대기
      delay: 300,
      // Diff 임계값 (0.0 ~ 1.0)
      diffThreshold: 0.2,
    },
    // 배경 설정
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#1a1a2e',
        },
        {
          name: 'gray',
          value: '#f5f5f5',
        },
      ],
    },
  },
  // 글로벌 데코레이터
  decorators: [
    (Story) => (
      <div style={{ padding: '1rem' }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
