import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import styles from '../styles.module.css';

class UserRow extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired
  }

  getUserCellData = () => {
    if (this.props.user.nickname) {
      return `${this.props.user.nickname} (${this.props.user.email})`;
    }

    return this.props.user.email;
  }

  getPermissionsStr = () => {
    let formattedPermissions;
    if (this.props.user.permissions.length === 0) {
      formattedPermissions = 'none';
    }
    else {
      formattedPermissions = this.props.user.permissions.join(', ');
    }

    return formattedPermissions;
  }

  render() {
    return (
      <tr className={styles.mainRow}>
        <td>{this.getUserCellData()}</td>
        <td></td>
        <td>{this.getPermissionsStr()}</td>
      </tr>
    );
  }
}

class RoleRow extends React.Component {
  static propTypes = {
    permissions: PropTypes.object.isRequired,
    role: PropTypes.string.isRequired
  }

  getPermissions = () => {
    const { permissions } = this.props;
    if (permissions) {
      return permissions.join(', ');
    }
    return 'none';
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
    user: PropTypes.object.isRequired,
    rolePermissions: PropTypes.object.isRequired
  }

  getRoleRows = () => {
    const { user, rolePermissions } = this.props;
    const roleRows = [];
    if (user && user.roles.length > 0 && rolePermissions && Object.keys(rolePermissions).length > 0) {
      user.roles.forEach((role) => {
        // TODO: FIGURE OUT WHY THIS IS SO OFTEN UNDEFINED
        if (rolePermissions[role] === undefined) {
          rolePermissions[role] = '';
        }
        roleRows.push(<RoleRow role={role} permissions={rolePermissions[role]} key={`${user.id}-${role}`} />);
      });
    }
    return roleRows;
  }

  render() {
    return (
      <tbody className={this.props.className}>
        <UserRow user={this.props.user} key={this.props.user.id} />
        {this.getRoleRows()}
      </tbody>
    );
  }

}

// TODO: Filter based on state's input
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

//TODO for search: if user.nickname || user.email contains query input, push; else continue
//TODO:  Add checkbox to allow user to optionally view *all* user permissions w/o this filter
class UserPermissionsTable extends React.Component {
  static propTypes = {
    rolePermissions: PropTypes.object.isRequired,
    userPermissions: PropTypes.array.isRequired,
    headers: PropTypes.array.isRequired,
    globalValue: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      searchInput: ''
    };
  }

  componentWillReceiveProps() {
  }

  getUserGroupRows = () => {
    const { rolePermissions, userPermissions } = this.props;
    const rows = [];
    userPermissions.forEach((user) => {

      // Hide rows where user has same permissions as the default permissions for authenticated users
      if (user.permissions.length > 0) {
        user.permissions.forEach((permission) => {
          if (this.props.globalValue.indexOf(permission) === -1) {
            rows.push(<UserGroupRow user={user} rolePermissions={rolePermissions} key={user.id} />);
            return;
          }
        });
      }

      rows.push(<UserGroupRow className={styles.hidden} user={user} rolePermissions={rolePermissions} key={user.id} />);
    });

    return rows;
  }

  onSearchInput = (e) => {
    e.preventDefault();
    this.setState({ searchInput: e.target.value });
  }

  render() {
    const headers = [];
    this.props.headers.forEach((header, i) => {
      headers.push(<th key={i}>{header}</th>);
    });

    // TODO: Add checkbox to show/hide all users (default: show only users with non-default permissions);
    // TODO: Get globalValue from state

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

function mapStateToProps(state) {
  const permissionsSummary = state.get('permissionsSummary');

  return {
    globalValue: permissionsSummary.get('globalValue').toJS()
  }
}

export default connect(mapStateToProps)(UserPermissionsTable);
