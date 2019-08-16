module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  // add your custom rules here
  'rules': {
    'semi': ['error', 'never'],
    'quotes': ['error', 'single'],
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  },
  globals: {
    requestAnimationFrame: true,
    performance: true
  },
  'env': {
    'node': true
  }
}
