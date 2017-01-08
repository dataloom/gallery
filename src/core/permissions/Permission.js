// @flow

import { Enum } from 'enumify';

function enumFactory(friendlyName) {
  return {
    get friendlyName() {
      return friendlyName;
    },
    hasPermission(permission: Permission) {
      return this.ordinal >= permission.ordinal;
    }
  };
}

class Permission extends Enum {}
Permission.initEnum({
  'HIDDEN': enumFactory("Hidden"),
  'DISCOVER': enumFactory("Discover"),
  'READ': enumFactory("Read"),
  'WRITE': enumFactory("Write"),
  'OWNER': enumFactory("Owner")
});

const ALL_PERMISSIONS = Array.from(Permission);

function maxPermission(permissions: Permission) {
  let highestPerm = Permission.HIDDEN;

  for (let permission of permissions) {
    if (permission.ordinal > highestPerm.ordinal) {
      highestPerm = permission;
    }
  }
}

export default {
  HIDDEN: Permission.HIDDEN,
  DISCOVER: Permission.DISCOVER,
  READ: Permission.READ,
  WRITE: Permission.WRITE,
  OWNER: Permission.OWNER,
  ALL_PERMISSIONS,

  Permission,
  maxPermission
}