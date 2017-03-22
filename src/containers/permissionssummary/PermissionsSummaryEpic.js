import Immutable from 'immutable';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';

import { EntityDataModelApi, PermissionsApi, PrincipalsApi } from 'loom-data';
import * as actionTypes from './PermissionsSummaryActionTypes';
import * as actionFactories from './PermissionsSummaryActionFactory';
import * as permissionsActionFactory from '../permissions/PermissionsActionFactory';

function loadAclsEpic(action$ :Observable<Action>) :Observable<Action> {
  return action$
    .ofType(actionTypes.LOAD_ACLS_REQUEST)
    .mergeMap((action :Action) => {
      const aclKey = [action.entitySetId];
      if (action.property && action.property.id) aclKey.push(action.property.id);
      return Observable
        .from(
          // loadAllUsersAndRoles
          PermissionsApi.getAcl(aclKey)
          // permissionsActionFactory.getAclRequest(aclKey) // error: object is not observable
        )
        .mergeMap((acl) => {
          return Observable.of(
            //loadAllUsersAndRoles
            actionFactories.loadAclsSuccess(acl),
            //updateStateAcls
          );
        })
        .catch(() => {
          return Observable.of(
            actionFactories.loadAclsFailure()
          );
        });
    });
}

export default combineEpics(
  loadAclsEpic
);
