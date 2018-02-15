import React, { PropTypes } from 'react';
import Immutable from 'immutable';

import UserRow from './UserRow';
import RoleRow from './RoleRow';
import styles from '../styles.module.css';


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
        roleRows.push(
          <RoleRow key={`${role}_${userId}`} permissions={rolePermissions.get(role)} role={role} />
        );
      });
    }
    roleRows.push(
      <RoleRow key={`${INDIVIDUAL}_${userId}`} permissions={user.get('individualPermissions')} role={INDIVIDUAL} />
    );

    return roleRows;
  }

  render() {
    const individualPermissions = this.props.user.get('individualPermissions', Immutable.List());
    if (individualPermissions.isEmpty()) {
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
