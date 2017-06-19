/*
 * @flow
 */

import { EntityDataModelApi } from 'loom-data';
import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';

import * as AsyncActionFactory from '../async/AsyncActionFactory';
import * as actionTypes from './EdmActionTypes';
import * as actionFactories from './EdmActionFactories';
import * as EdmActionFactory from './EdmActionFactory';

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
          const actions :Object[] = [];
          Object.keys(response).forEach((namespace :string) => {
            const types :Object = response[namespace];
            Object.keys(types).forEach((id :string) => {
              actions.push(AsyncActionFactory.updateAsyncReference({ id, namespace }, types[id]));
            });
          });
          return actions;
        })
        .catch(() => {
          return Observable.of({
            type: 'NO_OP'
          });
        });
    });
}

function updateMetadataEpic(action$) {
  return action$.ofType(actionTypes.UPDATE_ENTITY_SET_METADATA_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .from(EntityDataModelApi.updateEntitySetMetaData(action.entitySetId, action.metadataUpdate))
        .mergeMap(() => {
          return Observable.of(
            actionFactories.updateEntitySetMetadataResolve()
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

function fetchAllEntitySetsEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(actionTypes.FETCH_ALL_ENTITY_SETS_REQUEST)
    .mergeMap(() => {
      return Observable
        .from(EntityDataModelApi.getAllEntitySets())
        .mergeMap((entitySets :Object[]) => {
          return Observable.of(
            EdmActionFactory.fetchAllEntitySetsSuccess(entitySets),
            // HACK
            {
              type: 'UPDATE_ENTITY_SET_ASYNC_REFERENCES',
              entitySets
            }
          );
        })
        .catch(() => {
          return Observable.of(
            EdmActionFactory.fetchAllEntitySetsFailure()
          );
        });
    });
}

function fetchAllEntityTypesEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(actionTypes.FETCH_ALL_ENTITY_TYPES_REQUEST)
    .mergeMap(() => {
      return Observable
        .from(EntityDataModelApi.getAllEntityTypes())
        .mergeMap((entityTypes :Object[]) => {
          return Observable.of(
            EdmActionFactory.fetchAllEntityTypesSuccess(entityTypes),
            // HACK
            {
              type: 'UPDATE_ENTITY_TYPE_ASYNC_REFERENCES',
              entityTypes
            }
          );
        })
        .catch(() => {
          return Observable.of(
            EdmActionFactory.fetchAllEntityTypesFailure()
          );
        });
    });
}

function fetchAllPropertyTypesEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(actionTypes.FETCH_ALL_PROPERTY_TYPES_REQUEST)
    .mergeMap(() => {
      return Observable
        .from(EntityDataModelApi.getAllPropertyTypes())
        .mergeMap((propertyTypes :Object[]) => {
          return Observable.of(
            EdmActionFactory.fetchAllPropertyTypesSuccess(propertyTypes),
            // HACK
            {
              type: 'UPDATE_PROPERTY_TYPE_ASYNC_REFERENCES',
              propertyTypes
            }
          );
        })
        .catch(() => {
          return Observable.of(
            EdmActionFactory.fetchAllPropertyTypesFailure()
          );
        });
    });
}

function fetchEntitySetProjectionEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(actionTypes.FETCH_ENTITY_SET_PROJECTION_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .from(EntityDataModelApi.getEntityDataModelProjection(action.edmProjection))
        .mergeMap((response) => {

          const actions :Object[] = [
            EdmActionFactory.fetchEntitySetProjectionSuccess(response)
          ];

          // TODO: figure out what to do with this async references pattern
          Object.keys(response).forEach((namespace :string) => {
            const types :Object = response[namespace];
            Object.keys(types).forEach((id :string) => {
              actions.push(AsyncActionFactory.updateAsyncReference({ id, namespace }, types[id]));
            });
          });

          return actions;
        })
        .catch(() => {
          return Observable.of(
            EdmActionFactory.fetchEntitySetProjectionFailure()
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
  fetchEntitySetProjectionEpic
);
