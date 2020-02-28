module.exports = {
  'moduleFileExtensions': [
    'js',
    'json'
  ],
  'transform': {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest'
  },
  'moduleNameMapper': {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}
