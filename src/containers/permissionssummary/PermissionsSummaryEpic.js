import Immutable from 'immutable';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import { PermissionsApi, PrincipalsApi } from 'loom-data';
import { ROLE, AUTHENTICATED_USER } from '../../utils/Consts/UserRoleConsts';
import * as actionTypes from './PermissionsSummaryActionTypes';
import * as actionFactory from './PermissionsSummaryActionFactory';


/* HELPER FUNCTIONS */
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
    roleAcls,
    userAcls,
    globalValue
  };
}

function getAclKey(action) {
  const property = action.property;
  const aclKey = [action.entitySetId];
  if (property && property.id) aclKey.push(action.property.id);
  return aclKey;
}

function getUsersAndRoles(users) {
  const allUsersById = users;
  const allRolesList = new Set();
  const myId = JSON.parse(localStorage.profile).user_id;
  Object.keys(users).forEach((userId) => {
    users[userId].roles.forEach((role) => {
      if (role !== AUTHENTICATED_USER) allRolesList.add(role);
    });
  });
  allUsersById[myId] = null;
  return {
    allUsersById,
    allRolesList
  };
}

function createAclsObservables(action) {
  const { entitySet } = action;
  const { properties } = action.entitySet.entityType;
  const loadAclsObservables = properties.map((property) => {
    return Observable.of(actionFactory.getUserRolePermissionsRequest(entitySet.id, property));
  });
  loadAclsObservables.unshift(Observable.of(actionFactory.getUserRolePermissionsRequest(entitySet.id)));
  return loadAclsObservables;
}


/* EPICS */
function getAllUsersAndRolesEpic(action$) {
  let entitySet;
  return action$
    .ofType(actionTypes.GET_ALL_USERS_AND_ROLES)
    .mergeMap((action) => {
      entitySet = action.entitySet;
      return Observable
        .from(
          PrincipalsApi.getAllUsers()
        )
        .mergeMap((users) => {
          const { allUsersById, allRolesList } = getUsersAndRoles(users);
          return Observable
            .of(
              actionFactory.getAllUsersAndRolesSuccess(allUsersById, allRolesList),
              actionFactory.getAcls(entitySet)
            );
        })
        .catch((err) => {
          console.log('Error in getAllUsersAndRolesEpic:', err);
        });
    });
}

function getAclsEpic(action$ :Observable<Action>) :Observable<Action> {
  return action$
  .ofType(actionTypes.GET_ACLS)
  .mergeMap((action) => {
    const loadAclsObservables = createAclsObservables(action);
    return loadAclsObservables;
  })
  .mergeMap((observables) => {
    return observables;
  });
}

function getUserRolePermissionsEpic(action$ :Observable<Action>) :Observable<Action> {
  return action$
    .ofType(actionTypes.GET_USER_ROLE_PERMISSIONS_REQUEST)
    .mergeMap((action :Action) => {
      const aclKey = getAclKey(action);
      return Observable
        .from(
          PermissionsApi.getAcl(aclKey)
        )
        .mergeMap((acl) => {
          const configuredAcls = configureAcls(acl.aces);
          return Observable.of(
            actionFactory.setRolePermissions(action.property, configuredAcls),
            actionFactory.setUserPermissions(action.property, configuredAcls)
          );
        })
        .catch((err) => {
          console.log('Error in getUserRolePermissions:', err);
        });
    });
}

export default combineEpics(
  getAclsEpic,
  getUserRolePermissionsEpic,
  getAllUsersAndRolesEpic
);
