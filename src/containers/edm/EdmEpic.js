/* @flow */
import Immutable from 'immutable';
import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';
import { normalize } from 'normalizr';

import {
  EntityDataModelApi
} from 'loom-data';

import * as EdmStorage from './EdmStorage';
import * as actionTypes from './EdmActionTypes';
import * as actionFactories from './EdmActionFactories';
import * as AsyncActionFactory from '../async/AsyncActionFactory';

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
        .catch(() => {
          return Observable.of(
            actionFactories.allPropertyTypesReject('Failed to load Property Types')
          );
        });
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
        .catch(() => {
          return Observable.of(
            actionFactories.allEntityTypesReject('Failed to load Entity Types')
          );
        });
    });
}

/**
 * Listens for updateNormalizedData actions and dispatches object references
 */
function referenceEpic(action$) {
  return action$.ofType(actionTypes.UPDATE_NORMALIZED_DATA)
    .pluck('normalizedData')
    .mergeMap((normalizedData) => {
      const references = EdmStorage.getReferencesFromNormalizedData(normalizedData);
      // Old references
      const actions = references.map(actionFactories.edmObjectResolve);

      // Async code
      for (const namespace of normalizedData.keys()) {
        const namespaceData = normalizedData.get(namespace);
        for (const id of namespaceData.keys()) {
          const asyncReference = {
            namespace,
            id
          };
          const value = namespaceData.get(id);
          actions.push(AsyncActionFactory.updateAsyncReference(asyncReference, value.toJS()));
        }
      }

      return actions;
    });
}

// TODO: Cancellation and Error handling
function loadEdm(edmQuery) {
  return Observable.from(EntityDataModelApi.getEntityDataModelProjection(edmQuery))
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
