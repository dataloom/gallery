import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import * as actionTypes from './TopUtilizersActionTypes';
import * as actionFactory from './TopUtilizersActionFactory';

function submitQueryEpic(action$, state) {
  return action$
    .ofType(actionTypes.SUBMIT_TOP_UTILIZERS_REQUEST)
    .mergeMap((action) => {
      let topUtilizersDetailsList = state.get('topUtilizersDetailsList').toJS();
      topUtilizersDetailsList = Object.values(topUtilizersDetailsList);
      return Observable
        .from(
          // API.findTopUtilizers(state.get('entitySetId'), 100, topUtilizersDetailsList)
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
