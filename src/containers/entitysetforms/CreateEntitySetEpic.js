/* @flow */
import { Observable } from 'rxjs';
import { EntityDataModelApi } from 'loom-data';
import { normalize } from 'normalizr';
import Immutable from 'immutable';

import * as actionTypes from './CreateEntitySetActionTypes';
import * as actionFactories from './CreateEntitySetActionFactories';
import * as edmActionFactories from '../edm/EdmActionFactories';
import { EntitySetNschema, COLLECTIONS } from '../edm/EdmStorage';

function createEntitySet(entitySet) {
  return Observable.from(EntityDataModelApi.createEntitySets([entitySet]))
    .map(response => {
      return Object.assign({}, entitySet, {
        id: response[entitySet.name]
      });
    })
    .flatMap(savedEntitySet => {
      const ndata = normalize(savedEntitySet, EntitySetNschema);
      const reference = {
        collection: COLLECTIONS.ENTITY_TYPE,
        id: ndata.result
      };
      return [
        edmActionFactories.updateNormalizedData(Immutable.fromJS(ndata.entities)),
        actionFactories.createEntitySetResolve(reference)
      ];
    })
    // Error Handling
    .catch(error => {
      console.error(error);
      return Observable.of(actionFactories.createEntitySetReject("Error saving entity set"))
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