import React, { PropTypes } from 'react';
import Immutable from 'immutable';

import UserRow from './UserRow';
import RoleRow from './RoleRow';
import { INDIVIDUAL } from '../../../utils/Consts/PermissionsSummaryConsts';


class UserGroupRow extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    rolePermissions: PropTypes.instanceOf(Immutable.Map).isRequired,
    user: PropTypes.instanceOf(Immutable.Map).isRequired
  }

  getRoleRows = () => {
    const { user, rolePermissions } = this.props;
    const roleRows = [];
    const userRoles = user.get('roles');
    const userId = user.get('id');

    if (user && userRoles.size > 0 && rolePermissions && rolePermissions.size > 0) {
      userRoles.forEach((role) => {
        const id = role.get('id');
        const title = role.get('title');
        roleRows.push(
          <RoleRow key={`${id}_${userId}`} permissions={rolePermissions.get(title)} role={title} />
        );
      });
    }

    roleRows.push(
      <RoleRow key={`${INDIVIDUAL}_${userId}`} permissions={user.get('individualPermissions')} role={INDIVIDUAL} />
    );

    return roleRows;

  }

  render() {
    const permissions = this.props.user.get('permissions', Immutable.List());
    if (permissions.isEmpty()) {
      return null;
    }

    return (
      <tbody className={this.props.className}>
        <UserRow user={this.props.user} key={this.props.user.get('id')} />
        {this.getRoleRows()}
      </tbody>
    );
  }
}

export default UserGroupRow;
