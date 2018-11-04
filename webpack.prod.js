const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = (env) => merge(common(env), {
    mode: 'production',
    devtool: 'source-map',
});
