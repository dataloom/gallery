import Immutable from 'immutable';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import { PermissionsApi, PrincipalsApi, EntityDataModelApi } from 'loom-data';
import { ROLE, USER, AUTHENTICATED_USER } from '../../utils/Consts/UserRoleConsts';
import * as actionTypes from './PermissionsSummaryActionTypes';
import * as actionFactory from './PermissionsSummaryActionFactory';
import { PERMISSIONS } from '../permissions/PermissionsStorage';


/* HELPER FUNCTIONS */
function toCamelCase(s) {
  return s.charAt(0) + s.slice(1).toLowerCase();
}

function getPermission(permissions) {
  const newPermissions = [];
  if (permissions.includes(PERMISSIONS.OWNER)) return [toCamelCase(PERMISSIONS.OWNER)];
  if (permissions.includes(PERMISSIONS.WRITE)) newPermissions.push(toCamelCase(PERMISSIONS.WRITE));
  if (permissions.includes(PERMISSIONS.READ)) newPermissions.push(toCamelCase(PERMISSIONS.READ));
  if (permissions.includes(PERMISSIONS.LINK)) newPermissions.push(toCamelCase(PERMISSIONS.LINK));
  if (permissions.includes(PERMISSIONS.DISCOVER)) newPermissions.push(toCamelCase(PERMISSIONS.DISCOVER));
  return newPermissions;
}

function configureAcls(aces) {
  let authenticatedUserPermissions = [];
  const roleAcls = { Discover: [], Link: [], Read: [], Write: [] };
  const userAcls = { Discover: [], Link: [], Read: [], Write: [], Owner: [] };
  aces.forEach((ace) => {
    if (ace.permissions.length > 0) {
      if (ace.principal.type === ROLE) {
        if (ace.principal.id === AUTHENTICATED_USER) {
          authenticatedUserPermissions = getPermission(ace.permissions);
        }
        else {
          getPermission(ace.permissions).forEach((permission) => {
            roleAcls[permission].push(ace.principal.id);
          });
        }
      } else if (ace.principal.type === USER) {
        getPermission(ace.permissions).forEach((permission) => {
          userAcls[permission].push(ace.principal.id);
        });
      }
    }
  });
  return {
    roleAcls,
    userAcls,
    authenticatedUserPermissions
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
  Object.keys(users).forEach((userId) => {
    users[userId].roles.forEach((role) => {
      if (role !== AUTHENTICATED_USER) allRolesList.add(role);
    });
  });
  return {
    allUsersById,
    allRolesList
  };
}

function createAclsObservables(action, entityType) {
  const { entitySet } = action;
  const { properties } = entityType;
  const loadAclsObservables = properties.map((property) => {
    return Observable.of(actionFactory.getUserRolePermissionsRequest(entitySet.id, property));
  });
  loadAclsObservables.unshift(Observable.of(actionFactory.getUserRolePermissionsRequest(entitySet.id)));
  return loadAclsObservables;
}


/* EPICS */
// TODO: Use spinner when loading, based on status ^
function getAllUsersAndRolesEpic(action$) {
  let entitySet;
  return action$
    .ofType(actionTypes.GET_ALL_USERS_AND_ROLES_REQUEST)
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
        .catch((e) => {
          console.error(e);
          return Observable.of(
            actionFactory.getAllUsersAndRolesFailure()
          );
        });
    });
}

function getAclsEpic(action$ :Observable<Action>) :Observable<Action> {
  return action$
  .ofType(actionTypes.GET_ACLS)
  .mergeMap((action :Action) => {
    return Observable
      .from(
        EntityDataModelApi.getEntityType(action.entitySet.entityTypeId)
      )
      .mergeMap((entityType) => {
        return createAclsObservables(action, entityType);
      })
      .mergeMap((observables) => {
        return observables;
      })
      .catch((e) => {
        // TODO: add real error handling
        console.error(e);
        return { type: 'noop' };
      });
  })
  .catch((e) => {
    // TODO: add real error handling
    console.error(e);
    return { type: 'noop' };
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
            actionFactory.getUserRolePermissionsSuccess(),
            actionFactory.setRolePermissions(action.property, configuredAcls),
            actionFactory.setUserPermissions(action.property, configuredAcls)
          );
        })
        .catch((e) => {
          console.error(e);
          return Observable.of(
            actionFactory.getUserRolePermissionsFailure()
          );
        });
    });
}

export default combineEpics(
  getAclsEpic,
  getUserRolePermissionsEpic,
  getAllUsersAndRolesEpic
);
