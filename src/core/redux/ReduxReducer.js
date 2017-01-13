/*
 * @flow
 */

import {
  combineReducers
} from 'redux-immutable';

import catalogReducer from '../../containers/catalog/CatalogReducer';
import ndataReducer from '../../containers/ndata/NdataReducer';
import entitySetDetailReducer from '../../containers/entitysetdetail/EntitySetDetailReducer';

export default function reduxReducer() {

  return combineReducers({
    normalizedData: ndataReducer,
    catalog: catalogReducer,
    entitySetDetail: entitySetDetailReducer
  });
}
