import Webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import APP_CONFIG from '../app.config';
import APP_PATHS from '../app.paths';
import PACKAGE from '../../package';

import {
  AUTH0_DOMAIN,
  AUTH0_CLIENT_ID
} from '../auth/auth0.config';

import {
  isDev,
  isProd
} from '../env';


export const BANNER_PLUGIN = new Webpack.BannerPlugin({
  banner: APP_CONFIG.BANNER,
  entryOnly: true
});

export const DEFINE_PLUGIN = new Webpack.DefinePlugin({
  __DEV__: JSON.stringify(isDev),
  __PROD__: JSON.stringify(isProd),
  __VERSION__: JSON.stringify(`v${PACKAGE.version}`),
  __AUTH0_CLIENT_ID__: JSON.stringify(AUTH0_CLIENT_ID),
  __AUTH0_DOMAIN__: JSON.stringify(AUTH0_DOMAIN)
});

export const EXTRACT_TEXT_PLUGIN = new ExtractTextPlugin(`${APP_PATHS.REL.STATIC_CSS}/${APP_CONFIG.APP_CSS}`);