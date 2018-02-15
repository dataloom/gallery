import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Table } from 'react-bootstrap';
import { connect } from 'react-redux';

import { AUTHENTICATED_USER } from '../../../utils/Consts/UserRoleConsts';
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

// TODO: Separate components into different files
class UserPermissionsTable extends React.Component {

  static propTypes = {
    headers: PropTypes.array.isRequired,
    rolePermissions: PropTypes.instanceOf(Immutable.Map).isRequired,
    userPermissions: PropTypes.instanceOf(Immutable.List).isRequired,
    authenticatedUserPermissions: PropTypes.instanceOf(Immutable.List)
  }

  getUserGroupRows = () => {
    const { rolePermissions, userPermissions } = this.props;
    const rows = [];

    userPermissions.forEach((user) => {
      const permissions = user.get('permissions', Immutable.List());

      // If user has permissions, and they are different than the default permissions, add UserGroupRow
      if (!permissions.isEmpty()) {
        let i = 0;
        let notUnique = true;

        while (notUnique && i < permissions.size) {
          const permission = permissions.get(i);
          if (
            this.props.authenticatedUserPermissions
              && this.props.authenticatedUserPermissions.indexOf(permission) === -1
          ) {
            rows.push(
              <UserGroupRow key={user.get('id')} rolePermissions={rolePermissions} user={user} />
            );
            notUnique = false;
          }

          i += 1;
        }
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

function mapStateToProps(state, ownProps) {
  return {
    authenticatedUserPermissions: ownProps.rolePermissions.get(AUTHENTICATED_USER)
  };
}

export default connect(mapStateToProps)(UserPermissionsTable);
