module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: [],
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).[tj]s'
  ],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  transformIgnorePatterns: [
    '/node_modules/(?!(sequelize-test-helpers|chai)/)'
  ],
  transform: {
    '^.+\.jsx?$': 'babel-jest', // Use babel-jest to transform .js and .jsx files
  },
};
