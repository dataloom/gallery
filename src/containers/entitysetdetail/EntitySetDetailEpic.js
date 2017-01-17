/* @flow */
import { normalize } from 'normalizr';
import Immutable from 'immutable';
import { Observable } from 'rxjs/Observable';

import { DataModels, EntityDataModelApi } from 'loom-data';

import * as actionTypes from './EntitySetDetailActionTypes';
import * as actionFactories from './EntitySetDetailActionFactories';
import * as ndataActionFactories from '../ndata/NdataActionFactories';
import { Permission } from '../../core/permissions/Permission';
import { EntitySetNschema } from '../../components/entityset/EntitySetStorage';

function loadEntitySetDetail(id:string) {
  return Observable.from(EntityDataModelApi.getEntitySet(id))
    .map(result => normalize(result, EntitySetNschema))
    .map(Immutable.fromJS)
    .flatMap(normalizedData => [
      ndataActionFactories.updateNormalizedData(normalizedData.get('entities')),
      actionFactories.entitySetDetailResolve(normalizedData.get('result'))
    ]);
}

// TODO: Cancellation and Error handling
function loadEntitySetDetailEpic(action$) {
  // Filter on Action
  return action$.ofType(actionTypes.ENTITY_SET_REQUEST)
    // Get Id(s)
    .map(action => action.id)
    .mergeMap(loadEntitySetDetail)
}

export default loadEntitySetDetailEpic;