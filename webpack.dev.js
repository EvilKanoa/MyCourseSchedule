const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = env =>
  merge(common(env), {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
      contentBase: './dist',
      port: 3000,
      historyApiFallback: true,
    },
  });
