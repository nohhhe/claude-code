/** @type {import('jest').Config} */
module.exports = {
  displayName: '@cookshare/types',
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapping: {
    '^@cookshare/(.*)$': '<rootDir>/../$1/src',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts}',
    '<rootDir>/src/**/*.{test,spec}.{ts}'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts}',
    '!src/**/*.d.ts',
    '!src/**/index.ts'
  ],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  moduleFileExtensions: ['ts', 'js'],
  clearMocks: true
};