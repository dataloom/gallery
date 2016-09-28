/*
 * @flow
 */

const AUTH0_CLIENT_ID = 'KvwsETaUxuXVjW2cmz2LbdqXQBdYs6wH';
const AUTH0_DOMAIN = 'loom.auth0.com';

const JSON = 'JSON';
const CSV = 'CSV';

const PUT = 'PUT';
const GET = 'GET';

const DATASTORE_CATALOG_URL = 'http://localhost:8095/v1';
const SCHEMAS = '/schema';
const ENTITY_SET = '/entity/set';
const ENTITYSET = '/entityset';
const ENTITY_TYPE = '/entity/type';
const DATA = '/data';
const ENTITYDATA = '/entitydata';
const ENTITY_DATA = '/entitydata';
const MULTIPLE = '/multiple';

const SCHEMA_BASE_PATH = DATASTORE_CATALOG_URL.concat(SCHEMAS);
const ENTITY_SETS_BASE_PATH = DATASTORE_CATALOG_URL.concat(ENTITY_SET);
const ENTITY_TYPES_BASE_PATH = DATASTORE_CATALOG_URL.concat(ENTITY_TYPE);
const ENTITY_TYPE_DATA_URL = DATASTORE_CATALOG_URL.concat(DATA).concat(ENTITY_DATA);
const SCHEMA_DATA_URL = ENTITY_TYPE_DATA_URL.concat(MULTIPLE);
const ENTITY_SET_DATA_BASE_URL = DATASTORE_CATALOG_URL.concat(DATA).concat(ENTITYSET);

const ERROR_STATE = {
  hide: 'hiddenErrorMsg',
  show: 'errorMsg'
};

export default {
  AUTH0_CLIENT_ID,
  AUTH0_DOMAIN,
  JSON,
  CSV,
  PUT,
  GET,
  DATASTORE_CATALOG_URL,
  SCHEMAS,
  ENTITY_SET,
  ENTITY_TYPE,
  SCHEMA_BASE_PATH,
  ENTITY_SETS_BASE_PATH,
  ENTITY_TYPES_BASE_PATH,
  ENTITY_TYPE_DATA_URL,
  SCHEMA_DATA_URL,
  ENTITY_SET_DATA_BASE_URL,
  ENTITYDATA,
  ERROR_STATE
};
