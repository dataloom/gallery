/*
 * @flow
 */

/* eslint-disable import/extensions */

import {
  isProd
} from '../env.js';

export const AUTH0_CLIENT_ID :string =
  isProd
    ? 'KvwsETaUxuXVjW2cmz2LbdqXQBdYs6wH'
    : 'PTmyExdBckHAiyOjh4w2MqSIUGWWEdf8';

export const AUTH0_DOMAIN :string = 'loom.auth0.com';
