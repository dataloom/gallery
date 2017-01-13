/* @flow */
import Immutable from 'immutable';

import * as actionTypes from './NdataActionTypes';

export const INITIAL_STATE:Immutable.Map<*, *> = Immutable.fromJS({});

export default function reducer(state:Immutable.Map = INITIAL_STATE, action:Object) {
  switch (action.type) {
    case actionTypes.UPDATE_NORMALIZED_DATA:
      // Merge 1 level deep
      return action.normalizedData.reduce((newState, collection, collectionName) => {
        return newState.mergeIn([collectionName], collection);
      }, state);
    default:
      return state;
  }
}