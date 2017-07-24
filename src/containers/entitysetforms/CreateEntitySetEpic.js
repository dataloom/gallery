/*
 * @flow
 */

import { EntityDataModelApi } from 'loom-data';
import { Observable } from 'rxjs';

import * as actionTypes from './CreateEntitySetActionTypes';
import * as actionFactories from './CreateEntitySetActionFactories';

import * as datasetActionFactories from '../datasets/DatasetsActionFactory';

import { COLLECTIONS } from '../edm/EdmAsyncStorage';

function createEntitySet(entitySet) {
  return Observable.from(EntityDataModelApi.createEntitySets([entitySet]))
    .map((response) => {
      return Object.assign({}, entitySet, {
        id: response[entitySet.name]
      });
    })
    .mergeMap((savedEntitySet) => {
      const reference = {
        collection: COLLECTIONS.ENTITY_TYPE,
        id: savedEntitySet.id
      };
      return Observable.of(
        actionFactories.createEntitySetResolve(reference),
        datasetActionFactories.getOwnedDatasetsIdsRequest(null)
      );
    })
    .catch(() => {
      return Observable.of(
        actionFactories.createEntitySetReject('Error saving entity set')
      );
    });
}

// TODO: Cancellation and Error handling
function createEntitySetEpic(action$) {
  return action$.ofType(actionTypes.CREATE_ENTITY_SET_REQUEST)
  // Run search
    .map(action => action.entitySet)
    .mergeMap(createEntitySet);
}

export default createEntitySetEpic;
