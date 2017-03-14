import { ActionsObservable } from 'redux-observable/lib/ActionsObservable';
import { Subject } from 'rxjs/Subject';

export default (epic, count, action, callback, state = {}) => {
  const actions = new Subject();
  const actions$ = new ActionsObservable(actions);
  const store = {
    getState: () => {
      return state;
    }
  };
  epic(actions$, store)
    .take(count)
    .toArray()
    .subscribe(callback);
  if (action.length) {
    action.map((act) => {
      return actions.next(act);
    });
  } else {
    actions.next(action);
  }
};
