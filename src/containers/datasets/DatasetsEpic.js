/* @flow */
import { Observable } from 'rxjs';
import { normalize } from 'normalizr';
import Immutable from 'immutable';
import { combineEpics } from 'redux-observable';
import { AuthorizationApi, EntityDataModelApi } from 'loom-data';

import * as actionTypes from './DatasetsActionTypes';
import * as actionFactories from './DatasetsActionFactory';
import { Permission } from '../../core/permissions/Permission';
import * as edmActionFactories from '../edm/EdmActionFactories';
import { EntitySetNschema } from '../edm/EdmStorage';

function ownedDatasetsIdsEpic(action$) {
  return action$
    .ofType(actionTypes.GET_OWNED_DATASETS_IDS_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .from(AuthorizationApi.getAccessibleObjects('EntitySet', Permission.OWNER.name, action.pagingToken))
        .mergeMap((response) => {
          const edmDetailsSelectors = response.authorizedObjects.map((aclKey) => {
            return {
              type: 'EntitySet',
              id: aclKey[0],
              include: ['EntitySet']
            };
          });
          return Observable.of(
            actionFactories.getOwnedDatasetsIdsResolve(),
            actionFactories.getOwnedDatasetsDetailsRequest(edmDetailsSelectors, response.pagingToken)
          );
        })
        // Error Handling
        .catch(error => {
          console.error(error);
          return Observable.of(actionFactories.getOwnedDatasetsIdsReject('Error loading owned entity set ids'))
        });
    });
}

function ownedDatasetsDetailsEpic(action$) {
  return action$
    .ofType(actionTypes.GET_OWNED_DATASETS_DETAILS_REQUEST)
    .mergeMap((action :Action) => {
      let entitySets = [];
      return Observable
        .from(EntityDataModelApi.getEntityDataModelProjection(action.edmDetailsSelectors))
        .map((response) => {
          entitySets = Object.values(response.entitySets);
          return normalize(entitySets, [EntitySetNschema]);
        })
        .map(Immutable.fromJS)
        .flatMap(normalizedData => {
          return [
            edmActionFactories.updateNormalizedData(normalizedData.get('entities')),
            actionFactories.getOwnedDatasetsDetailsResolve(entitySets, action.pagingToken)
          ]
        })
        // Error Handling
        .catch(error => {
          console.error(error);
          return Observable.of(actionFactories.getOwnedDatasetsDetailsReject('Error loading owned entity set details'))
        });
    });
}

export default combineEpics(
  ownedDatasetsIdsEpic,
  ownedDatasetsDetailsEpic
);
