import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Custom render function that includes providers if needed
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
    </>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Mock data for testing
export const mockRecipes = [
  {
    id: '1',
    title: '김치찌개',
    description: '집에서 만드는 정통 김치찌개. 시원하고 칼칼한 맛이 일품입니다.',
    author: '요리하는 엄마',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: '쉬움',
    rating: 4.8,
    image: '/api/placeholder/300/200'
  },
  {
    id: '2',
    title: '불고기',
    description: '달콤하고 고소한 전통 불고기. 특별한 양념장이 포인트입니다.',
    author: '한식요리사',
    prepTime: 30,
    cookTime: 15,
    servings: 6,
    difficulty: '보통',
    rating: 4.6,
    image: '/api/placeholder/300/200'
  }
];

// Mock user data
export const mockUser = {
  id: '1',
  name: '테스트 사용자',
  email: 'test@example.com',
  avatar: '/api/placeholder/40/40'
};

// Helper function to wait for async operations
export const waitFor = (callback: () => void, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const check = () => {
      try {
        callback();
        resolve(true);
      } catch (error) {
        if (Date.now() - startTime > timeout) {
          reject(error);
        } else {
          setTimeout(check, 50);
        }
      }
    };
    check();
  });
};

// Mock fetch for API calls
export const mockFetch = (data: any, options: { status?: number; ok?: boolean } = {}) => {
  const { status = 200, ok = true } = options;
  
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok,
      status,
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
    })
  ) as jest.Mock;
};

// Reset all mocks helper
export const resetMocks = () => {
  jest.clearAllMocks();
  if (global.fetch && typeof global.fetch === 'function') {
    (global.fetch as jest.Mock).mockClear();
  }
};