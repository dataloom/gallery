const APP_PATHS = require('../app.paths.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

exports.BABEL_LOADER = {
  loader: 'babel-loader',
  test: /\.(js|jsx)$/,
  include: [
    APP_PATHS.ABS.SOURCE,
    APP_PATHS.ABS.TEST
  ]
};

exports.CSS_LOADER = {
  loader: ExtractTextPlugin.extract(
    'css-loader?modules&localIdentName=[local]--[hash:base64:5]&importLoader=1!postcss-loader?config=config/postcss/postcss.config.js'
  ),
  test: /\.css$/,
  exclude: /src\/core\/styles\/global\/.*\.css/
};

exports.CSS_LOADER_GLOBALS = {
  loader: ExtractTextPlugin.extract(
    'css-loader'
  ),
  test: /\.css$/,
  include: /src\/core\/styles\/global\/.*\.css/
};

exports.JSON_LOADER = {
  loader: 'json-loader',
  test: /\.json$/
};

exports.MEDIA_FILE_LOADER = {
  loader: 'file-loader',
  test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
  query: {
    name: `${APP_PATHS.REL.STATIC_MEDIA}/[name].[hash:8].[ext]`
  }
};

exports.MEDIA_URL_LOADER = {
  loader: 'url-loader',
  test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
  query: {
    limit: 10000,
    name: `${APP_PATHS.REL.STATIC_MEDIA}/[name].[hash:8].[ext]`
  }
};