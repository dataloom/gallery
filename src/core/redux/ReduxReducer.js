/*
 * @flow
 */

import {
  combineReducers
} from 'redux-immutable';

import { reducer as catalogReducer } from '../../containers/catalog/CatalogReducer';

export default function reduxReducer() {

  return combineReducers({
    catalog: catalogReducer
  });
}
