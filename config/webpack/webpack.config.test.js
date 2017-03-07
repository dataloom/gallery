const loaders = require('./loaders');

exports = {
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
};