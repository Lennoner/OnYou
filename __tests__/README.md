# Testing Guide

## Setup

To run tests, you'll need to install testing dependencies:

```bash
npm install --save-dev jest @jest/globals @types/jest ts-jest
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

## Configuration

Create `jest.config.js`:

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  preset: 'ts-jest',
}

module.exports = createJestConfig(customJestConfig)
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- __tests__/api/discover.test.ts

# Run with coverage
npm test -- --coverage
```

## Test Structure

- `__tests__/api/` - API endpoint tests
- `__tests__/components/` - React component tests (to be added)
- `__tests__/lib/` - Utility function tests (to be added)

## Current Status

⚠️ **Note**: Test files are currently placeholders with commented-out code.
To make them functional, you need to:

1. Set up test database
2. Configure authentication mocking
3. Implement actual API calls in tests
4. Add test data fixtures

## API Testing Checklist

For each endpoint, test:
- ✅ Successful requests with valid data
- ✅ Validation errors with invalid data
- ✅ Authentication/authorization
- ✅ Rate limiting
- ✅ Error handling
- ✅ Edge cases

## Example Test

```typescript
import { describe, it, expect } from '@jest/globals';

describe('API Validation', () => {
    it('should validate survey scores', () => {
        const { validateScores } = require('@/lib/validation');

        expect(validateScores({ q1: 3, q2: 4 })).toBe(true);
        expect(validateScores({ q1: 0 })).toBe(false); // Out of range
        expect(validateScores({ q1: 'invalid' })).toBe(false); // Wrong type
    });
});
```
