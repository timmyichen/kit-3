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
  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
        // https://github.com/kulshekhar/ts-jest/blob/master/docs/user/config/diagnostics.md#advanced-configuration
        // 2339 pops up on every test in travis for some reason
        ignoreCodes: [6059, 18002, 18003, 2339],
      },
    },
  },
};
