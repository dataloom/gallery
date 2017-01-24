/* @flow */
import Immutable from 'immutable';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import { normalize } from 'normalizr';

import { DataModels, EntityDataModelApi } from 'loom-data';

import * as EdmApi from '../Api';
import * as EdmStorage from './EdmStorage';
import * as actionTypes from './EdmActionTypes';
import * as actionFactories from './EdmActionFactories';

function allPropertyTypesEpic(action$) {
  return action$.ofType(actionTypes.ALL_PROPERTY_TYPES_REQUEST)
    .mergeMap(action => {
      return Observable.from(EntityDataModelApi.getAllPropertyTypes())
        .map(propertyTypes => normalize(propertyTypes, [EdmStorage.PropertyTypeNschema]))
        .flatMap(nData => {
          const references = nData.result.map(id => {
            return {
              id,
              collection: EdmStorage.COLLECTIONS.PROPERTY_TYPE
            }
          });
          return [
            actionFactories.updateNormalizedData(Immutable.fromJS(nData.entities)),
            actionFactories.allPropertyTypesResolve(references)
          ];
        })
        .catch(error => actionFactories.allPropertyTypesReject("Failed to load Property Types"))
    });
}

function allEntityTypesEpic(action$) {
  return action$.ofType(actionTypes.ALL_ENTITY_TYPES_REQUEST)
    .mergeMap(action => {
      return Observable.from(EntityDataModelApi.getAllEntityTypes())
        .map(entityTypes => normalize(entityTypes, [EdmStorage.EntityTypeNschema]))
        .flatMap(nData => {
          const references = nData.result.map(id => {
            return {
              id,
              collection: EdmStorage.COLLECTIONS.ENTITY_TYPE
            }
          });
          return [
            actionFactories.updateNormalizedData(Immutable.fromJS(nData.entities)),
            actionFactories.allEntityTypesResolve(references)
          ];
        })
        .catch(error => actionFactories.allEntityTypesReject("Failed to load Entity Types"))
    });
}

/**
 * Listens for updateNormalizedData actions and dispatches object references
 */
function referenceEpic(action$) {
  return action$.ofType(actionTypes.UPDATE_NORMALIZED_DATA)
    .pluck('normalizedData')
    .flatMap(normalizedData => {
      const references = EdmStorage.getReferencesFromNormalizedData(normalizedData);
      return references.map(actionFactories.edmObjectResolve)
    });
}

// TODO: Cancellation and Error handling
function loadEdm(edmQuery) {
  return Observable.from(EdmApi.edmQuery(edmQuery))
    .map(Immutable.fromJS)
    .map(actionFactories.updateNormalizedData);
}

function loadEdmEpic(action$) {
  // Filter on Action
  return action$.ofType(actionTypes.FILTERED_EDM_REQUEST)
  // Get Id(s)
    .map(action => action.edmQuery)
    .mergeMap(loadEdm)
}

export default combineEpics(loadEdmEpic, referenceEpic, allEntityTypesEpic, allPropertyTypesEpic);