import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import { PermissionsApi, PrincipalsApi, EntityDataModelApi, OrganizationsApi } from 'lattice';

import { ROLE, USER, AUTHENTICATED_USER } from '../../utils/Consts/UserRoleConsts';
import * as actionTypes from './PermissionsSummaryActionTypes';
import * as actionFactory from './PermissionsSummaryActionFactory';
import * as orgsActionTypes from '../organizations/actions/OrganizationsActionTypes';
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

function configurePermissions(aces, allUsersById) {

  const rolePermissions = {
    [AUTHENTICATED_USER]: []
  };

  aces.forEach((ace) => {
    if (ace.permissions.length > 0 && ace.principal.type === ROLE) {
      if (ace.principal.id === AUTHENTICATED_USER) {
        rolePermissions[AUTHENTICATED_USER] = getPermission(ace.permissions);
      }

      rolePermissions[ace.principal.id] = getPermission(ace.permissions);
    }
  });

  const userPermissions = configureUserPermissions(aces, rolePermissions, allUsersById);

  return {
    rolePermissions,
    userPermissions
  };
}

function configureUserPermissions(aces, rolePermissions, allUsersById) {
  let userPermissions = [];
  try {
    allUsersById.valueSeq().forEach(user => {
      const userObj = {};

      if (user) {
        userObj.id = user.user_id;
        userObj.nickname = user.nickname;
        userObj.email = user.email;
        userObj.roles = [];
        userObj.individualPermissions = [];
        userObj.permissions = [];

        // Get individual permissions
        aces.forEach(ace => {
          // add logic for if ace matches user
          if (ace.principal.id === user.user_id) {
            userObj.individualPermissions = getPermission(ace.permissions);
            userObj.permissions = getPermission(ace.permissions);
          }
        });

        // Add additional permissions based on user's roles, including AuthenticatedUser
        user.roles.forEach(role => {
          const permissions = rolePermissions[role];

          if (permissions) {
            permissions.forEach(permission => {
              if (userObj.permissions.indexOf(permission) === -1) {
                userObj.permissions.push(getPermission(permission));
              }
            });
          }
        });

        userPermissions.push(userObj);
      }
    });
  }
  catch(e) {
    console.error(e);
  }

  return userPermissions;
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
            if (roleAcls[permission]) {
              roleAcls[permission].push(ace.principal.id);
            }
          });
        }
      }
      else if (ace.principal.type === USER) {
        getPermission(ace.permissions).forEach((permission) => {
          if (userAcls[permission]) {
            userAcls[permission].push(ace.principal.id);
          }
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

function createAclsObservables(entitySetId, properties) {
  const loadAclsObservables = properties.map((property) => {
    return Observable.of(actionFactory.getUserRolePermissionsRequest(entitySetId, property));
  });
  loadAclsObservables.unshift(Observable.of(actionFactory.getUserRolePermissionsRequest(entitySetId)));
  return loadAclsObservables;
}


/* EPICS */
function getOrgsMembersEpic(action$, store) {
  return action$
    .ofType(orgsActionTypes.FETCH_ORGS_SUCCESS)
    .map((action) => {
      const orgs = store.getState().getIn(['organizations', 'organizations']);
      const orgIds = action.orgIds || orgs.toArray().map(entry => entry[0]);
      return orgIds;
    })
    .mergeMap(val => val)
    .mergeMap(orgId => {
      return Observable.from(
          OrganizationsApi.getAllMembers(orgId)
        )
        .map(members => {
          return Object.assign({}, { orgId, members });
        })
    })
    .mergeMap(membersObj => {
      return Observable.of(
        actionFactory.setOrgsMembers(membersObj)
      )
    })
    .catch((e) => {
      console.error('e:', e);
      return Observable.of(setOrgsMembersFailure());
    })
}

function getOrgsRolesEpic(action$, store) {
  return action$
    .ofType(orgsActionTypes.FETCH_ORGS_SUCCESS)
    .map((action) => {
      const orgs = store.getState().getIn(['organizations', 'organizations']);
      const orgIds = action.orgIds || orgs.toArray().map(entry => entry[0]);
      return orgIds;
    })
    .mergeMap(val => val)
    .mergeMap(orgId => {
      return Observable.from(
          OrganizationsApi.getAllRoles(orgId)
        )
    })
    .mergeMap(roles => {
      return Observable.of(
        actionFactory.setOrgsRoles(roles)
      )
    })
    .catch((e) => {
      console.error('e:', e);
      return Observable.of(setOrgsRolesFailure());
    })
}


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
    const edmQuery = [{
      type: 'EntitySet',
      id: action.entitySet.id,
      include: ['PropertyTypeInEntitySet']
    }];
    return Observable
      .from(
        EntityDataModelApi.getEntityDataModelProjection(edmQuery)
      )
      .mergeMap((edmDetails) => {
        return createAclsObservables(action.entitySet.id, Object.values(edmDetails.propertyTypes));
      })
      .mergeMap((observables) => {
        return observables;
      })
      .catch((e) => {
        // TODO: add real error handling
        return { type: 'noop' };
      });
  })
  .catch((e) => {
    // TODO: add real error handling
    return { type: 'noop' };
  });
}

function getUserRolePermissionsEpic(action$ :Observable<Action>, store) :Observable<Action> {
  return action$
    .ofType(actionTypes.GET_USER_ROLE_PERMISSIONS_REQUEST)
    .mergeMap((action :Action) => {
      const aclKey = getAclKey(action);
      return Observable
        .from(
          PermissionsApi.getAcl(aclKey)
        )
        .mergeMap((acl) => {
          const orgsRoles = store.getState().getIn(['permissionsSummary', 'orgsRoles']);
          const orgsMembers = store.getState().getIn(['permissionsSummary', 'orgsMembers']);

          // TODO: Pass in orgs' members & roles details to either configureAcls or setRole/UserPermissions actions as needed
          const configuredAcls = configureAcls(acl.aces);
          const allUsersById = store.getState().getIn(['permissionsSummary', 'allUsersById']);
          const permissions = configurePermissions(acl.aces, allUsersById);
          return Observable.of(
            actionFactory.getUserRolePermissionsSuccess(),
            actionFactory.setRolePermissions(action.property, permissions.rolePermissions),
            actionFactory.setUserPermissions(action.property, permissions.userPermissions)
          );
        })
        .catch((e) => {
          return Observable.of(
            actionFactory.getUserRolePermissionsFailure()
          );
        });
    });
}

export default combineEpics(
  getOrgsMembersEpic,
  getOrgsRolesEpic,
  getAclsEpic,
  getUserRolePermissionsEpic,
  getAllUsersAndRolesEpic
);
