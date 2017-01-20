/* @flow */
import { PropTypes } from 'react';
import { Map } from 'immutable';

export const ALL_PERMISSIONS = Object.freeze(['DISCOVER', 'LINK', 'READ', 'WRITE', 'OWNER']);

// TODO: Switch Permissions to Immutable.Map when Components are switched to immutable
export const DEFAULT_PERMISSIONS = Object.freeze({
  DISCOVER: false,
  LINK: false,
  READ: false,
  WRITE: false,
  OWNER: false
});

export type Permissions = {
  DISCOVER:boolean,
  LINK:boolean,
  READ:boolean,
  WRITE:boolean,
  OWNER:boolean
};
export const PermissionsPropType = PropTypes.shape({
  DISCOVER:PropTypes.bool.isRequired,
  LINK:PropTypes.bool.isRequired,
  READ:PropTypes.bool.isRequired,
  WRITE:PropTypes.bool.isRequired,
  OWNER:PropTypes.bool.isRequired
});

export type Authorization = {
  aclKey:string[],
  permissions: Permissions
};

export const AuthorizationPropType = PropTypes.shape({
  aclKey: PropTypes.arrayOf(PropTypes.string).isRequired,
  permissions: PermissionsPropType
});

/* Utility Functions */
export function deserializeAuthorization(rawAuthorization:Object):Authorization {
  return {
    aclKey: rawAuthorization.aclKey,
    permissions: Object.assign({}, DEFAULT_PERMISSIONS, rawAuthorization.permissions)
  };
}

/**
 * return permissions. If none are found, return default
 * @param permissionsState
 * @param aclKey
 */
export function getPermissions(permissionsState:Map<string,*>, aclKey:string[]):Permissions {
  const permissions = permissionsState.get('authorizations').getIn(aclKey.concat(['permissions']));
  if (permissions) {
    return permissions.toJS();
  } else {
    return DEFAULT_PERMISSIONS
  }
}