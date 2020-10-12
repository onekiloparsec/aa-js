const path = require('path')

module.exports = {
  target: 'web',
  entry: {
    index: './src/index.ts'
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'astronomical-algorithms',
    umdNamedDefine: true,
    globalObject: 'this'
  },
  devtool: 'source-map',
  externals: {
    dayjs: 'dayjs'
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader', exclude: /node_modules/ },
      { test: /\.js$/, loader: 'source-map-loader' }
    ]
  },
  optimization: {
    minimize: true
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  }
}
