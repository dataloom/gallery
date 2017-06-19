/*
 * @flow
 */

import Immutable from 'immutable';

import * as AsyncActionTypes from './AsyncActionTypes';

import {
  resolveReference,
  createCompleteValue
} from './AsyncStorage';

import type {
  AsyncContent
} from './AsyncStorage';

export const INITIAL_STATE :AsyncContent = Immutable.fromJS({});

export default function reducer(state :AsyncContent = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case AsyncActionTypes.UPDATE_ASYNC_REFERENCE:
      return resolveReference(state, action.reference, createCompleteValue(action.value));

    case AsyncActionTypes.RESOLVE_ASYNC_REFERENCE:
      return resolveReference(state, action.reference, action.value);

    /*
     * HACK
     */

    case AsyncActionTypes.UPDATE_ENTITY_SET_ASYNC_REFERENCES: {

      let newState :Map = state;
      action.entitySets.forEach((entitySet :Object) => {
        if (entitySet) {
          const reference = {
            id: entitySet.id,
            namespace: 'entitySets'
          };
          newState = resolveReference(newState, reference, createCompleteValue(entitySet));
        }
      });

      return newState;
    }

    case AsyncActionTypes.UPDATE_ENTITY_TYPE_ASYNC_REFERENCES: {

      let newState :Map = state;
      action.entityTypes.forEach((entityType :Object) => {
        if (entityType) {
          const reference = {
            id: entityType.id,
            namespace: 'entityTypes'
          };
          newState = resolveReference(newState, reference, createCompleteValue(entityType));
        }
      });

      return newState;
    }

    case AsyncActionTypes.UPDATE_PROPERTY_TYPE_ASYNC_REFERENCES: {

      let newState :Map = state;
      action.propertyTypes.forEach((propertyType :Object) => {
        if (propertyType) {
          const reference = {
            id: propertyType.id,
            namespace: 'propertyTypes'
          };
          newState = resolveReference(newState, reference, createCompleteValue(propertyType));
        }
      });

      return newState;
    }

    default:
      return state;
  }
}
