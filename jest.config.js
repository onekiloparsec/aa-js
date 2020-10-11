module.exports = {
  'moduleFileExtensions': [
    'js',
    'json',
    'ts'
  ],
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.json'
    }
  },
  'transform': {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/dayjs'
  ],
  'moduleNameMapper': {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testEnvironment: 'node'
}
