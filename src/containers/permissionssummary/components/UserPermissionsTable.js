import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { Table } from 'react-bootstrap';
import { AUTHENTICATED_USER } from '../../../utils/Consts/UserRoleConsts';
import { INDIVIDUAL, NONE } from '../../../utils/Consts/PermissionsSummaryConsts';
import styles from '../styles.module.css';

let counter = 0;
function getUniqueId() {
  counter += 1;
  return counter;
}

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
    user: PropTypes.instanceOf(Immutable.Map).isRequired,
    rolePermissions: PropTypes.instanceOf(Immutable.Map).isRequired,
    className: PropTypes.string
  }

  getRoleRows = () => {
    const { user, rolePermissions } = this.props;
    const roleRows = [];
    const userRoles = user.get('roles');
    if (user && userRoles.size > 0 && rolePermissions && rolePermissions.size > 0) {
      userRoles.forEach((role, i) => {
        roleRows.push(<RoleRow role={role} permissions={rolePermissions.get(role)} key={getUniqueId()} />);
      });
    }
    roleRows.push(<RoleRow
        role={INDIVIDUAL}
        permissions={user.get('individualPermissions')}
        key={getUniqueId()} />
      );

    return roleRows;
  }

  render() {
    return (
      <tbody className={this.props.className}>
        <UserRow user={this.props.user} key={getUniqueId()} />
        {this.getRoleRows()}
      </tbody>
    );
  }
}

// TODO: Finish search feature -> Filter based on state's input
class SearchBar extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired
  }

  render() {
    return (
      <form>
        <input
            type="text" placeholder="Search..." onChange={(e) => {
              this.props.onChange(e);
            }} />
      </form>
    );
  }
}

// TODO: Separate components into different files
class UserPermissionsTable extends React.Component {
  static propTypes = {
    rolePermissions: PropTypes.instanceOf(Immutable.Map).isRequired,
    userPermissions: PropTypes.instanceOf(Immutable.List).isRequired,
    headers: PropTypes.array.isRequired,
    authenticatedUserPermissions: PropTypes.instanceOf(Immutable.List)
  }

  constructor(props) {
    super(props);

    this.state = {
      searchInput: ''
    };
  }

  getUserGroupRows = () => {
    const { rolePermissions, userPermissions } = this.props;
    const rows = [];
    userPermissions.forEach((user, i) => {
      // Hide rows where user has same permissions as the default permissions for authenticated users
      const permissions = user.get('permissions');
      if (permissions.size > 0) {
        permissions.forEach((permission, j) => {
          if (this.props.authenticatedUserPermissions.indexOf(permission) === -1) {
            rows.push(<UserGroupRow
                user={user}
                rolePermissions={rolePermissions}
                key={getUniqueId()} />
            );
            return;
          }
        });
      }

      rows.push(<UserGroupRow
          className={styles.hidden}
          user={user}
          rolePermissions={rolePermissions}
          key={getUniqueId()} />
        );
    });

    return rows;
  }

  onSearchInput = (e) => {
    e.preventDefault();
    this.setState({ searchInput: e.target.value });
  }

  render() {
    const headers = [];
    this.props.headers.forEach((header) => {
      headers.push(<th key={getUniqueId()}>{header}</th>);
    });

    return (
      <div>
        <Table bordered responsive className={styles.table}>
          <thead>
            <tr>
              {headers}
            </tr>
          </thead>
          {this.getUserGroupRows()}
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
