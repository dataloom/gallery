/*
 * @flow
 */

import Immutable from 'immutable';

import { hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

/*
 * https://github.com/gajus/redux-immutable/blob/master/README.md#using-with-react-router-redux
 */

export default function initializeRouterHistory(reduxStore :Object) :Function {

  return syncHistoryWithStore(hashHistory, reduxStore, {
    selectLocationState: (state :Immutable.Map) => {
      return state.get('router').toJS();
    }
  });
}
