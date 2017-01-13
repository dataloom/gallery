/* @flow */
import { Map } from 'immutable';
import * as actionTypes from './NdataActionTypes';

export function updateNormalizedData(normalizedData: Map<string, Map<string, *>>) {
  return {
    type: actionTypes.UPDATE_NORMALIZED_DATA,
    normalizedData
  };
}
