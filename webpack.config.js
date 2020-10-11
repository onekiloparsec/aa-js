const path = require('path')

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js',
    libraryTarget: 'umd',
    library: 'astronomical-algorithms'
  },
  devtool: 'source-map',
  externals: {
    dayjs: 'dayjs'
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
      { test: /\.js$/, loader: 'source-map-loader' }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts']
  }
}
