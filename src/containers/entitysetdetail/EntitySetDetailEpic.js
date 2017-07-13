/*
 * @flow
 */

import Immutable from 'immutable';

import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';

import * as NeuronActionTypes from '../../core/neuron/NeuronActionTypes';
import * as NeuronSignalTypes from '../../core/neuron/NeuronSignalTypes';
import * as PermissionsActionFactory from '../permissions/PermissionsActionFactory';

import { ALL_PERMISSIONS } from '../permissions/PermissionsStorage';

function neuronSignalEntitySetPermissionRequestEpic(action$ :Observable<Action>, store :Object) :Observable<Action> {

  return action$
    .ofType(NeuronActionTypes.NEURON_SIGNAL)
    .mergeMap((action :Action) => {

      const entitySetId :UUID = action.signal.aclKey[0];

      const state :Map = store.getState();
      const entitySet :Map = state.getIn(['edm', 'entitySets', entitySetId], Immutable.Map());

      if (entitySet.isEmpty()) {
        // TODO - is there something else to be done here?
        return Observable.empty();
      }

      const entityTypeId :UUID = entitySet.get('entityTypeId');
      const entityType :Map = state.getIn(['edm', 'entityTypes', entityTypeId], Immutable.Map());

      // TODO - what happens to perf if the set of properties is really large?
      const propertyTypes :List = entityType.get('properties', Immutable.List()).map((propertyTypeId :UUID) => {
        return state.getIn(['edm', 'propertyTypes', propertyTypeId], Immutable.Map());
      });

      switch (action.signal.type) {

        case NeuronSignalTypes.PERMISSION_REQUEST_APPROVED: {
          if (entitySet.get('id') === entitySetId) {
            const accessChecks :AccessCheck[] = [];
            propertyTypes.forEach((propertyType :Object) => {
              accessChecks.push({
                aclKey: [entitySetId, propertyType.get('id')],
                permissions: ALL_PERMISSIONS
              });
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
          if (entitySet.get('id') === entitySetId) {
            const aclKeys :AclKey[] = [];
            propertyTypes.forEach((propertyType :Object) => {
              aclKeys.push([entitySetId, propertyType.get('id')]);
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
