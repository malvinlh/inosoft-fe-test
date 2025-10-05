/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.js'],
  moduleFileExtensions: ['js', 'jsx', 'json'],

  transform: {
    '^.+\\.(js|jsx)$': ['@swc/jest', {
      jsc: {
        // ⟵ aktifkan parser JSX
        parser: { syntax: 'ecmascript', jsx: true },
        target: 'es2020',
        transform: {
          react: { runtime: 'automatic', importSource: 'react' }
        }
      }
    }]
  },

  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/tests/styleMock.js'
  },

  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/router/**',
    '!src/styles/**',
    '!src/**/index.js'
  ],

  coverageThreshold: {
    global: { statements: 75, branches: 65, functions: 75, lines: 75 }
  }
};