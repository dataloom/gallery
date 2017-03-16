import Immutable from 'immutable';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';

import * as actionTypes from './PermissionsSummaryActionTypes';
import * as actionFactories from './PermissionsSummaryActionFactory';

export default combineEpics();
