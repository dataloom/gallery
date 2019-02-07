import { newRequestSequence } from 'redux-reqseq';

const GET_DB_ACCESS_CREDENTIAL :string = 'GET_DB_ACCESS_CREDENTIAL';
const getDbAccessCredential :RequestSequence = newRequestSequence(GET_DB_ACCESS_CREDENTIAL);

export {
  GET_DB_ACCESS_CREDENTIAL,
  getDbAccessCredential
};
