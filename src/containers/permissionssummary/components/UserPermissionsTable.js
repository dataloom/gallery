import React, { PropTypes } from 'react';
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

  render() {
    return (
      <tr className={styles.mainRow}>
        <td>{this.getUserCellData()}</td>
        <td>Effective permissions:</td>
        <td>{this.props.user.permissions}</td>
      </tr>
    );
  }
}

class RoleRow extends React.Component {
  static propTypes = {
    permissions: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired
  }

  getPermissions = () => {
    const { permissions } = this.props;
    if (permissions) {
      return permissions;
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
      <tbody>
        <UserRow user={this.props.user} key={this.props.user.id} />
        {this.getRoleRows()}
      </tbody>
    );
  }

}

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

export default class UserPermissionsTable extends React.Component {
  static propTypes = {
    rolePermissions: PropTypes.object.isRequired,
    userPermissions: PropTypes.array.isRequired,
    headers: PropTypes.array.isRequired
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
    userPermissions.forEach((user) => {
      //TODO for search: if user.nickname || user.email contains query input, push; else continue
      rows.push(<UserGroupRow user={user} rolePermissions={rolePermissions} key={user.id} />);
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

    return (
      <div>
        <SearchBar onChange={this.onSearchInput} />
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
