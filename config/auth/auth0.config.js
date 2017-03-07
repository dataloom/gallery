/* eslint-disable import/extensions */

const isProd = require ('../env');

exports.AUTH0_CLIENT_ID =
  isProd
    ? 'KvwsETaUxuXVjW2cmz2LbdqXQBdYs6wH'
    : 'PTmyExdBckHAiyOjh4w2MqSIUGWWEdf8';

exports.AUTH0_DOMAIN = 'loom.auth0.com';
