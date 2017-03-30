import Immutable from 'immutable';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import { PermissionsApi, PrincipalsApi } from 'loom-data';
import { ROLE, AUTHENTICATED_USER } from '../../utils/Consts/UserRoleConsts';
import * as actionTypes from './PermissionsSummaryActionTypes';
import * as actionFactory from './PermissionsSummaryActionFactory';

const permissionOptions = {
  Discover: 'Discover',
  Link: 'Link',
  Read: 'Read',
  Write: 'Write',
  Owner: 'Owner'
};

function getPermission(permissions) {
  const newPermissions = [];
  if (permissions.includes(permissionOptions.Owner.toUpperCase())) return [permissionOptions.Owner];
  if (permissions.includes(permissionOptions.Write.toUpperCase())) newPermissions.push(permissionOptions.Write);
  if (permissions.includes(permissionOptions.Read.toUpperCase())) newPermissions.push(permissionOptions.Read);
  if (permissions.includes(permissionOptions.Link.toUpperCase())) newPermissions.push(permissionOptions.Link);
  if (permissions.includes(permissionOptions.Discover.toUpperCase())) newPermissions.push(permissionOptions.Discover);
  return newPermissions;
}

function configureAcls(aces) {
  let globalValue = [];
  const roleAcls = { Discover: [], Link: [], Read: [], Write: [] };
  const userAcls = { Discover: [], Link: [], Read: [], Write: [], Owner: [] };
  aces.forEach((ace) => {
    if (ace.permissions.length > 0) {
      if (ace.principal.type === ROLE) {
        if (ace.principal.id === AUTHENTICATED_USER) {
          globalValue = getPermission(ace.permissions);
        }
        else {
          getPermission(ace.permissions).forEach((permission) => {
            roleAcls[permission].push(ace.principal.id);
          });
        }
      }
      else {
        getPermission(ace.permissions).forEach((permission) => {
          userAcls[permission].push(ace.principal.id);
        });
      }
    }
  });

  return {
    newRoleValue: '',
    newEmailValue: '',
    updateError: false,
    roleAcls,
    userAcls,
    globalValue
  };
}

function intitialLoadEpic(action$ :Observable<Action>) :Observable<Action> {
  return action$
  .ofType(actionTypes.INITIAL_LOAD)
  .mergeMap((action) => {
    return Observable.of(
      actionFactory.getAllUsersAndRoles(action.entitySet)
    );
  });
  // catch
}

function loadEntitySetEpic(action$ :Observable<Action>) :Observable<Action> {
  // TODO: RENAME THIS TO BE GET ACLS
  return action$
  .ofType(actionTypes.LOAD_ENTITY_SET)
  .mergeMap((action) => {
    const { entitySet } = action;
    const { properties } = action.entitySet.entityType;
    const loadAclsObservables = properties.map((property) => {
      return Observable.of(actionFactory.updateAclsEpicRequest(entitySet.id, property));
    });
    loadAclsObservables.unshift(Observable.of(actionFactory.updateAclsEpicRequest(entitySet.id)));
    return loadAclsObservables;
  })
  .mergeMap((observables) => {
    return observables;
  });
}

function updateStateAclsEpic(action$ :Observable<Action>) :Observable<Action> {
  return action$
    .ofType(actionTypes.LOAD_ACLS_REQUEST, actionTypes.UPDATE_ACLS_EPIC_REQUEST)
    .mergeMap((action :Action) => {
      const property = action.property;
      const aclKey = [action.entitySetId];
      if (action.property && action.property.id) aclKey.push(action.property.id);
      return Observable
        .from(
          PermissionsApi.getAcl(aclKey)
        )
        .mergeMap((acl) => {
          const configuredAcls = configureAcls(acl.aces);
          return Observable.of(
            actionFactory.setRolePermissions(property, configuredAcls),
            actionFactory.setUserPermissions(property, configuredAcls)
          );
        })
        .catch((err) => {
          // return Observable.of(
          //   actionFactory.updateStateAclsFailure()
          // );
        });
    });
}

function getAllUsersAndRolesEpic(action$) {
  let entitySet;
  return action$
    .ofType(actionTypes.LOAD_ACLS_REQUEST, actionTypes.GET_ALL_USERS_AND_ROLES)
    .mergeMap((action) => {
      entitySet = action.entitySet;
      return Observable
        .from(
          PrincipalsApi.getAllUsers()
        );
    })
    .mergeMap((users) => {
      const allUsersById = users;
      const allRolesList = new Set();
      const myId = JSON.parse(localStorage.profile).user_id;
      Object.keys(users).forEach((userId) => {
        users[userId].roles.forEach((role) => {
          if (role !== AUTHENTICATED_USER) allRolesList.add(role);
        });
      });
      allUsersById[myId] = null;

      return Observable
        .of(
          actionFactory.setAllUsersAndRoles(allUsersById, allRolesList), // -> TODO: make into success action containing logic above?
          actionFactory.setLoadUsersError(false),
          actionFactory.loadEntitySet(entitySet)
        );
    })
    .catch(() => {
      actionFactory.setLoadUsersError(true);
    });
}

export default combineEpics(
  intitialLoadEpic,
  loadEntitySetEpic,
  updateStateAclsEpic,
  getAllUsersAndRolesEpic
);
