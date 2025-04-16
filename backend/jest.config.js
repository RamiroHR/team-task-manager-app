module.exports = {
  // Directory where Jest should output the coverage files
  coverageDirectory: '__tests__/__output__',

  // Test environment
  testEnvironment: 'node',

  // Exclude coverage report files from test runs
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__output__/',
    '/coverage/'
  ]
};