/*
 * @flow
 */

import {
  combineReducers
} from 'redux-immutable';

import catalogReducer from '../../containers/catalog/CatalogReducer';

export default function reduxReducer() {

  return combineReducers({
    catalog: catalogReducer
  });
}
