/*
 * @flow
 */

import Immutable from 'immutable';

import {
  combineEpics
} from 'redux-observable';

import {
  Observable
} from 'rxjs';

// import * as EntitySetDetailActionTypes from './EntitySetDetailActionTypes';
// import * as EntitySetDetailActionFactory from './EntitySetDetailActionFactory';
import * as NeuronActionTypes from '../../core/neuron/NeuronActionTypes';
import * as NeuronSignalTypes from '../../core/neuron/NeuronSignalTypes';
import * as PermissionsActionFactory from '../permissions/PermissionsActionFactory';

import {
  getEdmObject
} from '../edm/EdmStorage';

import {
  ALL_PERMISSIONS
} from '../permissions/PermissionsStorage';

function neuronSignalEntitySetPermissionRequestEpic(action$ :Observable<Action>, store :Object) :Observable<Action> {

  return action$
    .ofType(NeuronActionTypes.NEURON_SIGNAL)
    .mergeMap((action :Action) => {

      const entitySetId :UUID = action.signal.aclKey[0];

      const state :Map = store.getState();
      const normalizedData :Map = state.get('normalizedData');
      const entitySetDetail :Map = state.get('entitySetDetail');
      const entitySetReference :Map = entitySetDetail.get('entitySetReference');

      let entitySet :Object = {};
      if (entitySetReference) {
        entitySet = getEdmObject(normalizedData.toJS(), entitySetReference.toJS());
      }

      switch (action.signal.type) {

        case NeuronSignalTypes.PERMISSION_REQUEST_APPROVED: {
          if (entitySet.id === entitySetId) {
            const accessChecks :AccessCheck[] = entitySet.entityType.properties.map((propertyType :Object) => {
              return {
                aclKey: [entitySetId, propertyType.id],
                permissions: ALL_PERMISSIONS
              };
            });
            if (accessChecks.length > 0) {
              return Observable.of(
                PermissionsActionFactory.checkAuthorizationRequest(accessChecks)
              );
            }
          }
          return Observable.empty();
        }

        case NeuronSignalTypes.PERMISSION_REQUEST_SUBMITTED: {
          if (entitySet.id === entitySetId) {
            const aclKeys :AclKey[] = entitySet.entityType.properties.map((propertyType :Object) => {
              return [entitySetId, propertyType.id];
            });
            if (aclKeys.length > 0) {
              return Observable.of(
                PermissionsActionFactory.loadOpenStatusesRequest(aclKeys)
              );
            }
          }
          return Observable.empty();
        }

        default:
          return Observable.empty();
      }
    });
}

export default combineEpics(
  neuronSignalEntitySetPermissionRequestEpic
);
