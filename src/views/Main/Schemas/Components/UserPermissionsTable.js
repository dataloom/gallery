import React, { PropTypes } from 'react';
import { Table } from 'react-bootstrap';
import styles from '../styles.module.css';

class UserRow extends React.Component {
  getUserCellData = () => {
    if (this.props.user.nickname) {
      return `${this.props.user.nickname} (${this.props.user.email})`;
    } else {
      return this.props.user.email;
    }
  }

  render() {
    return (
      <tr className={styles.userRow}>
        <td>{this.getUserCellData()}</td>
        <td>Effective permissions:</td>
        <td>{this.props.user.permissions}</td>
      </tr>
    );
  }
}

class RoleRow extends React.Component {
  componentDidMount() {
    const { permissions } = this.props;
  }

  getPermissions = () => {

    if (this.props.permissions) {
      return this.props.permissions;
    }
    return 'none';
  }

  render() {
    return (
      <tr className={styles.roleRow}>
        <td />
        <td>{this.props.role}</td>
        <td>{this.getPermissions()}</td>
      </tr>
    );
  }
}

class UserGroupRow extends React.Component {
  getRoleRows = () => {
    const rolePermissions = this.props.rolePermissions;
    const roleRows = [];
    if (this.props.user && this.props.user.roles.length > 0 && rolePermissions && Object.keys(rolePermissions).length > 0) {
      this.props.user.roles.forEach((role) => {
        roleRows.push(<RoleRow role={role} permissions={rolePermissions[role]} key={`${this.props.user.id}-${role}`} />);
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

  render() {
    return (
      <form>
        <input type="text" placeholder="Search..." onChange={(e) => {this.props.onChange(e)}} />
      </form>
    );
  }
}

export default class UserPermissionsTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchInput: ''
    }
  }

  getUserGroupRows = () => {
    const { rolePermissions } = this.props;
    const rows = [];
    this.props.userPermissions.forEach((user) => {
      // if user.nickname || user.email contains query input, push; else continue
      rows.push(<UserGroupRow user={user} rolePermissions={rolePermissions} key={user.id} />);
    });

    return rows;
  }

  onSearchInput = (e) => {
    e.preventDefault();
    this.setState({searchInput: e.target.value}, () => {
      console.log('search input:', this.state.searchInput);
    });
  }

  render() {
    const headers = [];
    this.props.headers.forEach((header, i) => {
      headers.push(<th key={i}>{header}</th>);
    });

    return (
      <div>
        <SearchBar onChange={this.onSearchInput} />
        <Table bordered responsive className={styles.expandableTable}>
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
