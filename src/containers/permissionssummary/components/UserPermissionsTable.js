import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Table } from 'react-bootstrap';
// import { AUTHENTICATED_USER } from '../../../utils/Consts/UserRoleConsts';
import { INDIVIDUAL, NONE } from '../../../utils/Consts/PermissionsSummaryConsts';
import styles from '../styles.module.css';

class UserRow extends React.Component {
  static propTypes = {
    user: PropTypes.instanceOf(Immutable.Map).isRequired
  }

  getUserCellData = () => {
    const { user } = this.props;
    if (user.get('nickname')) {
      return `${user.get('nickname')} (${user.get('email')})`;
    }

    return user.get('email');
  }

  getPermissionsStr = () => {
    const { user } = this.props;
    let formattedPermissions;
    if (user.get('permissions').size === 0) {
      formattedPermissions = NONE;
    }
    else {
      formattedPermissions = user.get('permissions').join(', ');
    }

    return formattedPermissions;
  }

  render() {
    return (
      <tr className={styles.mainRow}>
        <td>{this.getUserCellData()}</td>
        <td />
        <td>{this.getPermissionsStr()}</td>
      </tr>
    );
  }
}

class RoleRow extends React.Component {
  static propTypes = {
    permissions: PropTypes.instanceOf(Immutable.List),
    role: PropTypes.string.isRequired
  }

  getPermissions = () => {
    const { permissions } = this.props;
    if (permissions && permissions.size > 0) {
      return permissions.join(', ');
    }
    return NONE;
  }

  render() {
    const { role } = this.props;
    return (
      <tr className={styles.subRow}>
        <td />
        <td>{role}</td>
        <td>{this.getPermissions()}</td>
      </tr>
    );
  }
}

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
    return (
      <tbody className={this.props.className}>
        <UserRow user={this.props.user} key={this.props.user.get('id')} />
        {this.getRoleRows()}
      </tbody>
    );
  }
}

// TODO: Separate components into different files
class UserPermissionsTable extends React.Component {

  static propTypes = {
    headers: PropTypes.array.isRequired,
    rolePermissions: PropTypes.instanceOf(Immutable.Map).isRequired,
    userPermissions: PropTypes.instanceOf(Immutable.List).isRequired
  }

  getUserGroupRows = () => {
    const { rolePermissions, userPermissions } = this.props;
    const rows = [];

    userPermissions.forEach((user) => {
      const permissions = user.get('permissions', Immutable.List());
      if (!permissions.isEmpty()) {
        rows.push(
          <UserGroupRow key={user.get('id')} rolePermissions={rolePermissions} user={user} />
        );
      }
    });

    return rows;
  }

  render() {
    const headers = [];
    this.props.headers.forEach((header) => {
      headers.push(<th key={header}>{header}</th>);
    });

    return (
      <div>
        <Table bordered responsive className={styles.table}>
          <thead>
            <tr>
              {headers}
            </tr>
          </thead>
          { this.getUserGroupRows() }
        </Table>
      </div>
    );
  }
}

export default UserPermissionsTable;
