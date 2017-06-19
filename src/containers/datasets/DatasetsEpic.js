/*
 * @flow
 */

import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';
import { AuthorizationApi } from 'loom-data';

import * as actionTypes from './DatasetsActionTypes';
import * as actionFactories from './DatasetsActionFactory';

import { Permission } from '../../core/permissions/Permission';
import { fetchEntitySetProjectionRequest } from '../edm/EdmActionFactory';

function ownedDatasetsIdsEpic(action$) {
  return action$
    .ofType(actionTypes.GET_OWNED_DATASETS_IDS_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .from(AuthorizationApi.getAccessibleObjects('EntitySet', Permission.OWNER.name, action.pagingToken))
        .mergeMap((response) => {

          const edmProjection :Object[] = [];
          const ownedEntitySetIds :string[] = [];

          response.authorizedObjects.forEach((aclKey) => {
            const entitySetId :string = aclKey[0];
            edmProjection.push({
              type: 'EntitySet',
              id: entitySetId,
              include: ['EntitySet']
            });
            ownedEntitySetIds.push(entitySetId);
          });

          // how do I do this correctly...?
          return Observable.of(
            actionFactories.getOwnedDatasetsIdsResolve(ownedEntitySetIds, response.pagingToken),
            fetchEntitySetProjectionRequest(edmProjection)
          );
        })
        // Error Handling
        .catch(() => {
          return Observable.of(
            actionFactories.getOwnedDatasetsIdsReject('Error loading owned entity set ids')
          );
        });
    });
}

export default combineEpics(
  ownedDatasetsIdsEpic
);
