/*
 * @flow
 */

const APP_HTML = 'index.html';
const APP_INDEX_JS = 'app.js';

const MEDIA_FILE_REGEX = /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/;
const MEDIA_URL_REGEX = /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/;

module.exports = {
  APP_HTML,
  APP_INDEX_JS,
  MEDIA_FILE_REGEX,
  MEDIA_URL_REGEX
};
