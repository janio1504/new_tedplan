module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'app/**/*.js',
    '!app/Models/**',
    '!**/node_modules/**',
    '!**/test/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  moduleNameMapper: {
    '^App/(.*)$': '<rootDir>/app/$1',
    '^Config/(.*)$': '<rootDir>/config/$1'
  },
  moduleDirectories: ['node_modules', '<rootDir>'],
  testTimeout: 10000
};

