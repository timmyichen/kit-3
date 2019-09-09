module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleDirectories: ['node_modules', 'server'],
  moduleNameMapper: {
    '^server/(.*)': '<rootDir>/server/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/server/test/setup.js'],
};
