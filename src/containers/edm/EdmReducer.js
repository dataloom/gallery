/* @flow */
import Immutable from 'immutable';

import * as actionTypes from './EdmActionTypes';
import * as EdmStorage from './EdmStorage';

export const INITIAL_STATE:Immutable.Map<*, *> = Immutable.fromJS({});

export default function reducer(state:Immutable.Map = INITIAL_STATE, action:Object) {
  switch (action.type) {
    case actionTypes.UPDATE_NORMALIZED_DATA:
      let { normalizedData } = action;
      // Post Process
      normalizedData = normalizedData
        .update(EdmStorage.COLLECTIONS.ENTITY_SET, (entitySetMap) => {
          if (!entitySetMap) { return entitySetMap; }
          return entitySetMap.mapEntries(([id, entitySet]) => {
            return [id, entitySet.set('entityType', entitySet.get('entityTypeId'))]
          })
        });
      // Merge 1 level deep
      return normalizedData.reduce((newState, collection, collectionName) => {
        return newState.mergeIn([collectionName], collection);
      }, state);
    default:
      return state;
  }
}