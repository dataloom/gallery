/*
 * @flow
 */

import {
  combineReducers
} from 'redux-immutable';

import catalogReducer from '../../containers/catalog/CatalogReducer';
import ndataReducer from '../../containers/ndata/NdataReducer';

export default function reduxReducer() {

  return combineReducers({
    catalog: catalogReducer,
    normalizedData: ndataReducer
  });
}
