/*
 * @flow
 */

export const AUTHENTICATED_USER :string = 'AuthenticatedUser';
export const ADMIN :string = 'admin';
export const ORGANIZATION :string = 'ORGANIZATION';
export const USER :string = 'USER';
export const ROLE :string = 'ROLE';

const RESERVED_ROLES :string[] = [
  AUTHENTICATED_USER
];

export default {
  AUTHENTICATED_USER,
  ADMIN,
  ORGANIZATION,
  USER,
  ROLE,
  RESERVED_ROLES
};
