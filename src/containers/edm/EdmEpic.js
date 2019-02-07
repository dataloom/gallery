import { EntityDataModelApi } from 'lattice';
import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';

import * as AsyncActionFactory from '../async/AsyncActionFactory';
import * as actionTypes from './EdmActionTypes';
import * as actionFactories from './EdmActionFactories';
import * as EdmActionFactory from './EdmActionFactory';
import { entitySetDetailRequest } from '../entitysetdetail/EntitySetDetailActionFactory';

function loadEdmEpic(action$) {
  // Filter on Action
  return action$.ofType(actionTypes.FILTERED_EDM_REQUEST)
  // Get Id(s)
    .map(action => action.edmQuery)
    // .mergeMap(loadEdm)
    .mergeMap((edmQuery) => {
      return Observable
        .from(EntityDataModelApi.getEntityDataModelProjection(edmQuery))
        .mergeMap((response) => {
          const actions = [];
          Object.keys(response).forEach((namespace) => {
            const types= response[namespace];
            Object.keys(types).forEach((id) => {
              actions.push(AsyncActionFactory.updateAsyncReference({ id, namespace }, types[id]));
            });
          });
          return actions;
        })
        .catch((e) => {
          console.error(e);
          return Observable.of({
            type: 'NO_OP' // TODO - need a better error action
          });
        });
    });
}

function updateMetadataEpic(action$) {
  return action$.ofType(actionTypes.UPDATE_ENTITY_SET_METADATA_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(EntityDataModelApi.updateEntitySetMetaData(action.entitySetId, action.metadataUpdate))
        .mergeMap(() => {
          return Observable.of(
            actionFactories.updateEntitySetMetadataResolve(),
            actionFactories.loadEntitySet(action.entitySetId)
          );
        })
        .catch(() => {
          return Observable.of(actionFactories.updateEntitySetMetadataReject('Unable to update entity set metadata.'));
        });
    });
}

/*
 *
 *
 *
 */

function fetchAllEntitySetsEpic(action$) {

  return action$
    .ofType(actionTypes.FETCH_ALL_ENTITY_SETS_REQUEST)
    .mergeMap(() => {
      return Observable
        .from(EntityDataModelApi.getAllEntitySets())
        .mergeMap((entitySets) => {
          return Observable.of(
            EdmActionFactory.fetchAllEntitySetsSuccess(entitySets),
            // HACK
            {
              type: 'UPDATE_ENTITY_SET_ASYNC_REFERENCES',
              entitySets
            }
          );
        })
        .catch((e) => {
          console.error(e);
          return Observable.of(
            EdmActionFactory.fetchAllEntitySetsFailure()
          );
        });
    });
}

function fetchAllEntityTypesEpic(action$) {

  return action$
    .ofType(actionTypes.FETCH_ALL_ENTITY_TYPES_REQUEST)
    .mergeMap(() => {
      return Observable
        .from(EntityDataModelApi.getAllEntityTypes())
        .mergeMap((entityTypes) => {
          return Observable.of(
            EdmActionFactory.fetchAllEntityTypesSuccess(entityTypes),
            // HACK
            {
              type: 'UPDATE_ENTITY_TYPE_ASYNC_REFERENCES',
              entityTypes
            }
          );
        })
        .catch((e) => {
          console.error(e);
          return Observable.of(
            EdmActionFactory.fetchAllEntityTypesFailure()
          );
        });
    });
}

function fetchAllPropertyTypesEpic(action$) {

  return action$
    .ofType(actionTypes.FETCH_ALL_PROPERTY_TYPES_REQUEST)
    .mergeMap(() => {
      return Observable
        .from(EntityDataModelApi.getAllPropertyTypes())
        .mergeMap((propertyTypes) => {
          return Observable.of(
            EdmActionFactory.fetchAllPropertyTypesSuccess(propertyTypes),
            // HACK
            {
              type: 'UPDATE_PROPERTY_TYPE_ASYNC_REFERENCES',
              propertyTypes
            }
          );
        })
        .catch((e) => {
          console.error(e);
          return Observable.of(
            EdmActionFactory.fetchAllPropertyTypesFailure()
          );
        });
    });
}

function fetchEntitySetProjectionEpic(action$) {

  return action$
    .ofType(actionTypes.FETCH_ENTITY_SET_PROJECTION_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(EntityDataModelApi.getEntityDataModelProjection(action.edmProjection))
        .mergeMap((response) => {

          const actions = [
            EdmActionFactory.fetchEntitySetProjectionSuccess(response)
          ];

          // TODO: figure out what to do with this async references pattern
          Object.keys(response).forEach((namespace) => {
            const types= response[namespace];
            Object.keys(types).forEach((id) => {
              actions.push(AsyncActionFactory.updateAsyncReference({ id, namespace }, types[id]));
            });
          });

          return actions;
        })
        .catch((e) => {
          console.error(e);
          return Observable.of(
            EdmActionFactory.fetchEntitySetProjectionFailure()
          );
        });
    });
}

function getAllEntitySetPropertyMetadataEpic(action$) {

  return action$
    .ofType(actionTypes.GET_ALL_ENTITY_SET_PROPERTY_METADATA_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(EntityDataModelApi.getAllEntitySetPropertyMetadata(action.entitySetId))
        .mergeMap((entitySetPropertyMetadata) => {
          return Observable.of(
            actionFactories.getAllEntitySetPropertyMetadataResolve(action.entitySetId, entitySetPropertyMetadata),
          );
        })
        .catch((e) => {
          console.error(e);
          return Observable.of(
            actionFactories.getAllEntitySetPropertyMetadataReject(e)
          );
        });
    });
}

function updateEntitySetPropertyMetadataEpic(action$) {

  return action$
    .ofType(actionTypes.UPDATE_ENTITY_SET_PROPERTY_METADATA_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(EntityDataModelApi.updateEntitySetPropertyMetadata(
          action.entitySetId,
          action.propertyTypeId,
          action.update))
        .mergeMap(() => {
          return Observable.of(
            actionFactories.updateEntitySetPropertyMetadataResolve(),
          );
        })
        .catch((e) => {
          console.error(e);
          return Observable.of(
            actionFactories.updateEntitySetPropertyMetadataReject(e)
          );
        });
    });
}

export default combineEpics(
  loadEdmEpic,
  updateMetadataEpic,

  fetchAllEntitySetsEpic,
  fetchAllEntityTypesEpic,
  fetchAllPropertyTypesEpic,
  fetchEntitySetProjectionEpic,
  getAllEntitySetPropertyMetadataEpic,
  updateEntitySetPropertyMetadataEpic
);
