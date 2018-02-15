import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';
import { AuthorizationApi } from 'lattice';

import * as actionTypes from './DatasetsActionTypes';
import * as actionFactories from './DatasetsActionFactory';

import { Permission } from '../../core/permissions/Permission';
import { fetchEntitySetProjectionRequest } from '../edm/EdmActionFactory';

function ownedDatasetsIdsEpic(action$) {
  return action$
    .ofType(actionTypes.GET_OWNED_DATASETS_IDS_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(AuthorizationApi.getAccessibleObjects('EntitySet', Permission.OWNER.name, action.pagingToken))
        .mergeMap((response) => {

          const edmProjection = [];
          const ownedEntitySetIds = [];

          response.authorizedObjects.forEach((aclKey) => {
            const entitySetId = aclKey[0];
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
        .catch((e) => {
          console.error(e);
          return Observable.of(
            actionFactories.getOwnedDatasetsIdsReject('Error loading owned entity set ids')
          );
        });
    });
}

export default combineEpics(
  ownedDatasetsIdsEpic
);
