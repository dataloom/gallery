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

  getRolesStr = () => {
    if (this.props.user.roles.length > 0) {
      return 'effective permissions';
    }
    return 'none';
  }

  render() {
    return (
      <tr className={styles.UserGroupRow} onClick={this.props.toggleCollapse}>
        <td>{this.getUserCellData()}</td>
        <td>{this.getRolesStr()}</td>
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
//
// class SearchBar extends React.Component {
//   render() {
//     return (
//       <form>
//         <input type="text" placeholder="Search..." />
//       </form>
//     );
//   }
// }

export default class UserPermissionsTable extends React.Component {
  getUserGroupRows = () => {
    const { rolePermissions } = this.props;
    const rows = [];
    this.props.userPermissions.forEach((user) => {
      rows.push(<UserGroupRow user={user} rolePermissions={rolePermissions} key={user.id} />);
    });

    return rows;
  }

  render() {
    const headers = [];
    this.props.headers.forEach((header, i) => {
      headers.push(<th key={i}>{header}</th>);
    });

    return (
      <Table bordered responsive className={styles.expandableTable}>
        <thead>
          <tr>
            {headers}
          </tr>
        </thead>
        {this.getUserGroupRows()}
      </Table>
    );
  }
}
