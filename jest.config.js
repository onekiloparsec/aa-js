module.exports = {
  'moduleFileExtensions': [
    'js',
    'json'
  ],
  'transform': {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest'
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/dayjs'
  ],
  'moduleNameMapper': {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}
