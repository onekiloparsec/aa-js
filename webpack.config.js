const path = require('path')

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve('dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'astronomical-algorithms',
    umdNamedDefine: true
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
  optimization: {
    minimize: true
  },
  resolve: {
    extensions: ['.js', '.ts']
  }
}
