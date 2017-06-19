import * as actionTypes from './DatasetsActionTypes';

export function getOwnedDatasetsIdsRequest(pagingToken :String) {
  const returnVal = {
    type: actionTypes.GET_OWNED_DATASETS_IDS_REQUEST,
    pagingToken
  };
  return returnVal;
}

export function getOwnedDatasetsIdsResolve(ownedEntitySetIds :string[], pagingToken :string) {
  return {
    type: actionTypes.GET_OWNED_DATASETS_IDS_RESOLVE,
    ownedEntitySetIds,
    pagingToken
  };
}


export function getOwnedDatasetsIdsReject(errorMessage :string) {
  return {
    type: actionTypes.GET_OWNED_DATASETS_IDS_REJECT,
    errorMessage
  };
}

export function getOwnedDatasetsDetailsRequest(edmDetailsSelectors :Array, pagingToken :String) {
  return {
    type: actionTypes.GET_OWNED_DATASETS_DETAILS_REQUEST,
    edmDetailsSelectors,
    pagingToken
  };
}

export function getOwnedDatasetsDetailsResolve(ownedDatasets :Array, pagingToken :String) {
  return {
    type: actionTypes.GET_OWNED_DATASETS_DETAILS_RESOLVE,
    ownedDatasets,
    pagingToken
  };
}

export function getOwnedDatasetsDetailsReject(errorMessage :string) {
  return {
    type: actionTypes.GET_OWNED_DATASETS_DETAILS_REJECT,
    errorMessage
  };
}
