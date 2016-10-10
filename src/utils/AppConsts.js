/*
 * @flow
 */

const AUTH0_CLIENT_ID = 'KvwsETaUxuXVjW2cmz2LbdqXQBdYs6wH';
const AUTH0_DOMAIN = 'loom.auth0.com';

const JSON = 'JSON';
const CSV = 'CSV';

const PUT = 'PUT';
const GET = 'GET';

const DATASTORE = '/datastore';
const DATASTORE_CATALOG_URL = '/ontology';
const SCHEMAS = '/schema';
const ENTITY_SET = '/entity/set';
const ENTITYSET = '/entityset';
const ENTITY_TYPE = '/entity/type';
const DATA = '/data';
const ENTITYDATA = '/entitydata';
const ENTITY_DATA = '/entitydata';
const MULTIPLE = '/multiple';
const PROPERTY_TYPE = '/property/type';
const ADD_PROPERTY = '/addProperty';

const ENTITY_TYPE_DATA_URL = DATA.concat(ENTITY_DATA);
const SCHEMA_DATA_URL = ENTITY_TYPE_DATA_URL.concat(MULTIPLE);
const ENTITY_SET_DATA_BASE_URL = DATA.concat(ENTITYSET);

const ERROR_STATE = {
  hide: 'hidden',
  show: 'errorMsg'
};

export default {
  AUTH0_CLIENT_ID,
  AUTH0_DOMAIN,
  JSON,
  CSV,
  PUT,
  GET,
  DATASTORE,
  DATASTORE_CATALOG_URL,
  SCHEMAS,
  ENTITY_SET,
  ENTITY_TYPE,
  ENTITY_TYPE_DATA_URL,
  SCHEMA_DATA_URL,
  ENTITY_SET_DATA_BASE_URL,
  ENTITYDATA,
  ERROR_STATE,
  PROPERTY_TYPE,
  ADD_PROPERTY
};
