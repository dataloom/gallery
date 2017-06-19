import APP_PATHS from '../app.paths.js';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export const BABEL_LOADER = {
  test: /\.js$/,
  exclude: /node_modules/,
  include: [
    APP_PATHS.ABS.SOURCE,
    APP_PATHS.ABS.TEST
  ],
  use: ['babel-loader']
};

export const CSS_LOADER = {
  test: /\.css$/,
  exclude: [
    /node_modules/,
    /src\/core\/styles\/global\/.*\.css/
  ],
  use: ExtractTextPlugin.extract({
    use: [
      {
        loader: 'css-loader',
        options: {
          modules: true,
          localIdentName: '[local]--[hash:base64:5]',
          importLoaders: 1
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          config: {
            path: 'config/postcss/postcss.config.js'
          }
        }
      }
    ]
  })
};

export const CSS_LOADER_GLOBALS = {
  test: /\.css$/,
  exclude: /node_modules/,
  include: /src\/core\/styles\/global\/.*\.css/,
  use: ExtractTextPlugin.extract({
    use: ['css-loader']
  })
};

export const JSON_LOADER = {
  test: /\.json$/,
  exclude: /node_modules/,
  use: ['json-loader']
};

export const MEDIA_FILE_LOADER = {
  test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
  exclude: /node_modules/,
  use: [{
    loader: 'file-loader',
    options: {
      name: `${APP_PATHS.REL.STATIC_MEDIA}/[name].[hash:8].[ext]`
    }
  }]
};

export const MEDIA_URL_LOADER = {
  test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
  exclude: /node_modules/,
  use: [{
    loader: 'url-loader',
    options: {
      limit: 10000,
      name: `${APP_PATHS.REL.STATIC_MEDIA}/[name].[hash:8].[ext]`
    }
  }]
};
