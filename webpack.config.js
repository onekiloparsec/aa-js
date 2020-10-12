const path = require('path')
const webpack = require('webpack')

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
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: true,
      include: /\.min\.js$/
    })
  ],
  resolve: {
    extensions: ['.js', '.ts']
  }
}
