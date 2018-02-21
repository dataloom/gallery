import Immutable from 'immutable';

import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs';
import { DataApi } from 'lattice';

import * as NeuronActionTypes from '../../core/neuron/NeuronActionTypes';
import * as NeuronSignalTypes from '../../core/neuron/NeuronSignalTypes';
import * as PermissionsActionFactory from '../permissions/PermissionsActionFactory';
import * as actionTypes from './EntitySetDetailActionTypes';
import * as actionFactory from './EntitySetDetailActionFactory';

import { ALL_PERMISSIONS } from '../permissions/PermissionsStorage';

function getEntitySetSizeEpic(action$) {
  return action$
    .ofType(actionTypes.GET_ENTITY_SET_SIZE_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(DataApi.getEntitySetSize(action.id))
        .mergeMap((size) => {
          return Observable.of(
            actionFactory.getEntitySetSizeSuccess(size)
          );
        })
        // Error Handling
        .catch((e) => {
          console.error(e);
          return Observable.of(
            actionFactory.getEntitySetSizeFailure('Unable to load entity set size.')
          );
        });
    });
}

function neuronSignalEntitySetPermissionRequestEpic(action$, store) {

  return action$
    .ofType(NeuronActionTypes.NEURON_SIGNAL)
    .mergeMap((action) => {

      const entitySetId = action.signal.aclKey[0];

      const state = store.getState();
      const entitySet = state.getIn(['edm', 'entitySets', entitySetId], Immutable.Map());

      if (entitySet.isEmpty()) {
        // TODO - is there something else to be done here?
        return Observable.empty();
      }

      const entityTypeId = entitySet.get('entityTypeId');
      const entityType = state.getIn(['edm', 'entityTypes', entityTypeId], Immutable.Map());

      // TODO - what happens to perf if the set of properties is really large?
      const propertyTypes = entityType.get('properties', Immutable.List()).map((propertyTypeId) => {
        return state.getIn(['edm', 'propertyTypes', propertyTypeId], Immutable.Map());
      });

      switch (action.signal.type) {

        case NeuronSignalTypes.PERMISSION_REQUEST_APPROVED: {
          if (entitySet.get('id') === entitySetId) {
            const accessChecks = [];
            propertyTypes.forEach((propertyType) => {
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
            const aclKeys = [];
            propertyTypes.forEach((propertyType) => {
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
  getEntitySetSizeEpic,
  neuronSignalEntitySetPermissionRequestEpic
);
