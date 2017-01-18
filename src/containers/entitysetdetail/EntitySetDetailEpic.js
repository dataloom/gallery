/* @flow */
import { normalize } from 'normalizr';
import Immutable from 'immutable';
import { Observable } from 'rxjs/Observable';

import * as actionTypes from './EntitySetDetailActionTypes';
import * as actionFactories from './EntitySetDetailActionFactories';
import * as ndataActionFactories from '../ndata/NdataActionFactories';
import { EntitySetNschema } from '../../components/entityset/EntitySetStorage';

// // TODO: Load from cache
// function loadEntitySetDetail(id:string) {
//   return Observable.from(EntityDataModelApi.getEntitySet(id))
//     .map(result => normalize(result, EntitySetNschema))
//     .map(Immutable.fromJS)
//     .flatMap(normalizedData => [
//       ndataActionFactories.updateNormalizedData(normalizedData.get('entities')),
//       actionFactories.entitySetDetailResolve(normalizedData.get('result'))
//     ]);
// }
//
// // TODO: Cancellation and Error handling
// function loadEntitySetDetailEpic(action$) {
//   // Filter on Action
//   return action$.ofType(actionTypes.ENTITY_SET_REQUEST)
//     .mergeMap(action => loadEntitySetDetail(action.id))
// }

export default loadEntitySetDetailEpic;