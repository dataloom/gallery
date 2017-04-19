import Immutable from 'immutable';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import * as actionTypes from './TopUtilizersActionTypes';
import * as actionFactory from './TopUtilizersActionFactory';

function getEntitySetsEpic(action$) {
  return action$
    .ofType(actionTypes.GET_ENTITY_SETS_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(
          // GET request
        )
        .mergeMap((results) => {
          return Observable
            .of(
              actionFactory.getEntitySetsSuccess(results)
            );
        })
        .catch((err) => {
          actionFactory.getEntitySetsFailure();
        });
    });
}

function submitQueryEpic(action$) {
  return action$
    .ofType(actionTypes.SUBMIT_TOP_UTILIZERS_REQUEST)
    .mergeMap((action) => {
      return Observable
        .from(
          // submit request
        )
        .mergeMap((results) => {
          return Observable
            .of(
              actionFactory.onSubmitSuccess(results)
            );
        })
        .catch((err) => {
          actionFactory.onSubmitFailure();
        });
    });
}

export default combineEpics(
  submitQueryEpic
);
