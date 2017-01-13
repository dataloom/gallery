/* @flow */
import * as actionTypes from './NdataActionTypes';

export function updateNormalizedData(normalizedData) {
  return {
    type: actionTypes.UPDATE_NORMALIZED_DATA,
    normalizedData
  };
}
