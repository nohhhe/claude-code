# Task Completion Checklist

## Before Completing Any Task

1. **Test Execution**
   ```bash
   # Run all tests to ensure nothing is broken
   npm test
   
   # Test in UI mode to verify visual functionality
   npm run test:ui
   ```

2. **Mock Server Verification**
   ```bash
   # Ensure mock server starts without errors
   npm start
   # Verify server responds at http://localhost:3000
   ```

3. **Cross-browser Testing**
   ```bash
   # Test on all configured browsers
   npx playwright test --project=chromium
   npx playwright test --project=firefox  
   npx playwright test --project=webkit
   npx playwright test --project=mobile-chrome
   ```

## Code Quality Checks
- Ensure all test selectors are working correctly
- Verify visual elements display properly in UI mode
- Check that all form elements are properly named
- Validate that API endpoints respond correctly

## Documentation Updates
- Update README.md if new features are added
- Document any new test scenarios
- Update configuration notes if settings change

## Git Workflow
- Stage all changes: `git add .`
- Commit with descriptive message
- Include CLAUDE.md updates in commits

## Debugging Resources
- Use `npm run test:headed` for visual debugging
- Check `playwright-report/` for detailed test results
- Use `npm run show-report` for HTML report analysis
- Monitor console logs in mock server for API issues