/* @flow */
import Immutable from 'immutable';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import { normalize } from 'normalizr';

import { DataModels, EntityDataModelApi } from 'loom-data';

import * as EdmApi from './EdmApi';
import * as EdmStorage from './EdmStorage'
import * as actionTypes from './EdmActionTypes';
import * as actionFactories from './EdmActionFactories';

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
        .catch(error => actionFactories.allEntityTypesReject("Failed to load EntityTypes"))
    });
}

/**
 * Listens for updateNormalizedData actions and dispatches object references
 */
function referenceEpic(action$) {
  return action$.ofType(actionTypes.UPDATE_NORMALIZED_DATA)
    .map(action => action.normalizedData)
    .flatMap(normalizedData => {
      const objectReferences = normalizedData.reduce((references, idMap, collectionName) => {
        const currentRefs = idMap.keySeq().map((id) => {
          return {
            id,
            collection: collectionName
          }
        });
        references.push(currentRefs);
        return references;
      }, []);

      return objectReferences.map(actionFactories.edmObjectResolve)
    });
}

// TODO: Cancellation and Error handling
function loadEdm(edmQuery) {
  return Observable.from(EdmApi.edmQuery(edmQuery))
    .map(Immutable.fromJS)
    .map(normalizedData => {
      return normalizedData
        .update(EdmStorage.COLLECTIONS.ENTITY_SET, (entitySetMap) => {
          return entitySetMap.mapEntries(([id, entitySet]) => {
            return [id, entitySet.set('entityType', entitySet.get('entityTypeId'))]
          })
        });
    })
    .map(actionFactories.updateNormalizedData);
}

function loadEdmEpic(action$) {
  // Filter on Action
  return action$.ofType(actionTypes.FILTERED_EDM_REQUEST)
  // Get Id(s)
    .map(action => action.edmQuery)
    .mergeMap(loadEdm)
}

export default combineEpics(loadEdmEpic, referenceEpic, allEntityTypesEpic);