/*
 * @flow
 */

const AUTH0_CLIENT_ID = 'KvwsETaUxuXVjW2cmz2LbdqXQBdYs6wH';
const AUTH0_DOMAIN = 'loom.auth0.com';

const LOCAL = 'http://localhost:8080';
const STG = 'http://staging.loom.digital';
const PROD = 'http://api.loom.digital';

const JSON = 'json';
const CSV = 'csv';

const HIDDEN = 'hidden';
const DISCOVER = 'discover';
const READ = 'read';
const WRITE = 'write';
const OWNER = 'owner';

const DEFAULT_USER_ROLE = 'user';

const ADD = 'add';
const REMOVE = 'remove';
const SET = 'set';

const HOME = 'home';
const CATALOG = 'catalog';
const LOGIN = 'login';
const SETTINGS = 'settings';

const SCHEMA = 'schema';
const ENTITY_SET = 'entitySet';
const ENTITY_TYPE = 'entityType';
const PROPERTY_TYPE = 'propertyType';

const EMPTY = '';

export default {
  AUTH0_CLIENT_ID,
  AUTH0_DOMAIN,

  LOCAL,
  STG,
  PROD,

  JSON,
  CSV,

  HIDDEN,
  DISCOVER,
  READ,
  WRITE,
  OWNER,

  DEFAULT_USER_ROLE,

  ADD,
  REMOVE,
  SET,

  HOME,
  CATALOG,
  LOGIN,
  SETTINGS,

  SCHEMA,
  ENTITY_SET,
  ENTITY_TYPE,
  PROPERTY_TYPE,

  EMPTY
};
