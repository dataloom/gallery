/*
 * @flow
 */

import * as EdmActionTypes from './EdmActionTypes';

export function fetchAllEntitySetsRequest() :Object {

  return {
    type: EdmActionTypes.FETCH_ALL_ENTITY_SETS_REQUEST
  };
}

export function fetchAllEntitySetsSuccess(entitySets :Object[]) :Object {

  return {
    type: EdmActionTypes.FETCH_ALL_ENTITY_SETS_SUCCESS,
    entitySets
  };
}

export function fetchAllEntitySetsFailure() :Object {

  return {
    type: EdmActionTypes.FETCH_ALL_ENTITY_SETS_FAILURE
  };
}

export function fetchAllEntityTypesRequest() :Object {

  return {
    type: EdmActionTypes.FETCH_ALL_ENTITY_TYPES_REQUEST
  };
}

export function fetchAllEntityTypesSuccess(entityTypes :Object[]) :Object {

  return {
    type: EdmActionTypes.FETCH_ALL_ENTITY_TYPES_SUCCESS,
    entityTypes
  };
}

export function fetchAllEntityTypesFailure() :Object {

  return {
    type: EdmActionTypes.FETCH_ALL_ENTITY_TYPES_FAILURE
  };
}

export function fetchAllPropertyTypesRequest() :Object {

  return {
    type: EdmActionTypes.FETCH_ALL_PROPERTY_TYPES_REQUEST
  };
}

export function fetchAllPropertyTypesSuccess(propertyTypes :Object[]) :Object {

  return {
    type: EdmActionTypes.FETCH_ALL_PROPERTY_TYPES_SUCCESS,
    propertyTypes
  };
}

export function fetchAllPropertyTypesFailure() :Object {

  return {
    type: EdmActionTypes.FETCH_ALL_PROPERTY_TYPES_FAILURE
  };
}

export function fetchEntitySetProjectionRequest(edmProjection :Object[]) :Object {

  return {
    type: EdmActionTypes.FETCH_ENTITY_SET_PROJECTION_REQUEST,
    edmProjection
  };
}

export function fetchEntitySetProjectionSuccess(edm :Object) :Object {

  return {
    type: EdmActionTypes.FETCH_ENTITY_SET_PROJECTION_SUCCESS,
    edm
  };
}

export function fetchEntitySetProjectionFailure() :Object {

  return {
    type: EdmActionTypes.FETCH_ENTITY_SET_PROJECTION_FAILURE
  };
}

export function updateEntitySets(entitySets :Object[]) :Object {

  return {
    type: EdmActionTypes.UPDATE_ENTITY_SETS,
    entitySets
  };
}
