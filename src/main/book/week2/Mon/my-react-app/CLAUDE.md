# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React application created with Create React App (CRA) that serves as a demonstration project for the Claude Code 실용 가이드북 (Claude Code Practical Guidebook) project. The book project documents practical usage patterns and best practices for Claude Code in Korean.

## Development Commands

### Core Commands
- `npm start` - Start development server on http://localhost:3000 with hot reloading
- `npm test` - Run tests in interactive watch mode
- `npm run build` - Build production-ready app to `build/` folder
- `npm run eject` - Permanently expose webpack configuration (irreversible)

### Testing
- Run specific test: `npm test -- --testNamePattern="test name"`
- Run tests once without watch: `npm test -- --watchAll=false`
- Coverage report: `npm test -- --coverage`

### ESLint
The project uses CRA's default ESLint configuration. Linting errors will appear in the console during development.

## Project Architecture

### Directory Structure
```
src/
├── App.js          # Main application component
├── App.test.js     # Tests for App component
├── App.css         # Styles for App component
├── index.js        # Application entry point
├── index.css       # Global styles
├── setupTests.js   # Testing setup with jest-dom
└── reportWebVitals.js  # Performance monitoring
```

### Key Technologies
- **React 19.1.1** - UI framework
- **React Scripts 5.0.1** - CRA build tooling
- **Testing Library** - Component testing utilities
- **Jest** - Test runner configured via setupTests.js

### Testing Setup
Tests use @testing-library/react with jest-dom matchers. The setupTests.js file imports jest-dom for enhanced DOM assertions.

## Book Project Context

This React app is part of a larger documentation project for Claude Code. The parent project structure includes:
- `week1/` through `week4/` - Weekly learning modules
- Each week contains daily tutorials (day1-day5) and weekend reading materials
- Focus areas: Installation, configuration, workflow strategies, and optimization

## Development Guidelines

When modifying this React application:
1. Maintain the simple CRA structure for educational clarity
2. Keep examples practical and reproducible
3. Comment code examples in Korean for the guidebook audience
4. Focus on demonstrating Claude Code capabilities rather than complex React patterns