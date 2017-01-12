/* @flow */
import * as actionTypes from './NdataActionTypes';
import Immutable from 'immutable';

export const INITIAL_STATE = Immutable.fromJS({});

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.UPDATE_NORMALIZED_DATA:
      // Merge 1 level deep
      return action.normalizedData.reduce((state, collection, collectionName) => {
        return state.mergeIn([collectionName], collection);
      }, state);
    default:
      return state
  }
}