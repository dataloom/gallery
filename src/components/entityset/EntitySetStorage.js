// @flow

import { Permission } from '../../core/permissions/Permission';

export type EntitySet = {
  // DB Reference
  name: string,
  // Friendly name
  title: string,
  type: {
    name: string,
    namespace: string
  },
  permission: Permission
};
