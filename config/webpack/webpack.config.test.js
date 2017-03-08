const loaders = require('./loaders');
const plugins = require('./plugins');


module.exports = {
  module: {
    rules: [
      loaders.BABEL_LOADER,
      loaders.CSS_LOADER,
      loaders.CSS_LOADER_GLOBALS,
      loaders.JSON_LOADER,
      loaders.MEDIA_FILE_LOADER,
      loaders.MEDIA_URL_LOADER
    ]
  },
  plugins: [
    plugins.DEFINE_PLUGIN,
    plugins.EXTRACT_TEXT_PLUGIN
  ],
  devtool: 'inline-source-map'
};