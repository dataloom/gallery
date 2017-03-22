import {
  BABEL_LOADER,
  CSS_LOADER,
  CSS_LOADER_GLOBALS,
  JSON_LOADER,
  MEDIA_FILE_LOADER,
  MEDIA_URL_LOADER
} from './loaders';

import {
  DEFINE_PLUGIN,
  EXTRACT_TEXT_PLUGIN
} from './plugins';


export default {
  module: {
    rules: [
      BABEL_LOADER,
      CSS_LOADER,
      CSS_LOADER_GLOBALS,
      JSON_LOADER,
      MEDIA_FILE_LOADER,
      MEDIA_URL_LOADER
    ]
  },
  plugins: [
    DEFINE_PLUGIN,
    EXTRACT_TEXT_PLUGIN
  ],
  devtool: 'inline-source-map',
  externals: {
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
  }
};
