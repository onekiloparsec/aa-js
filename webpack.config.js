module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/lib',
    filename: 'index.js',
    library: 'astronomical-algorithms',
    libraryTarget: 'umd'
  },
  externals: {
    moment: 'moment'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  }
}
