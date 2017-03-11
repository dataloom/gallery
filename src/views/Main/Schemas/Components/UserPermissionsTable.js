import React, { PropTypes } from 'react';
import { Table } from 'react-bootstrap';
import styles from '../styles.module.css';

class UserRow extends React.Component {
  getClassName = () => {
    // Probably want to set a classname that allows for hover behavior (expanded rows should not have hover state)
    return this.props.isCollapsed ? `${styles.expandableRow} ${styles.collapse}`
    : `${styles.expandableRow} ${styles.collapseOpen}`;
  }

  getRolesStr = () => {
    if (this.props.user.roles.length > 0) {
      return 'effective permissions';
    } else {
      return 'none';
    }
  }

  render() {
    return (
      <tr className={this.getClassName()} onClick={this.props.toggleCollapse}>
        <td>{this.props.user.email}</td>
        <td>{this.getRolesStr()}</td>
        <td>{this.props.user.permissions}</td>
      </tr>
    );
  }
}

class RoleRow extends React.Component {
  getClassName = () => {
    // Probably want to set a classname that allows for hover behavior (expanded rows should not have hover state)
    return this.props.isCollapsed ? `${styles.roleRow} ${styles.hidden}` : `${styles.roleRow}`;
  }

  render() {
    return (
      <tr className={this.getClassName()}>
        <td />
        <td>{this.props.role.role}</td>
        <td>{this.props.role.permissions}</td>
      </tr>
    );
  }
}

class ExpandableRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isCollapsed: true
    };
  }

  toggleCollapse = () => {
    this.setState({ isCollapsed: !this.state.isCollapsed });
  }

  getRoleRows = () => {
    const roleRows = [];

    if (this.props.user.expand.length > 0) {
      this.props.user.expand.forEach((role) => {
        roleRows.push(<RoleRow role={role} isCollapsed={this.state.isCollapsed} key={`${this.props.user.id}-${role.role}`} />);
      });
    }

    return roleRows;
  }

  render() {
    return (
      <tbody>
        <UserRow user={this.props.user} isCollapsed={this.state.isCollapsed} toggleCollapse={this.toggleCollapse} key={this.props.user.id} />
        {this.getRoleRows()}
      </tbody>
    );
  }

}

class SearchBar extends React.Component {
  render() {
    return (
      <form>
        <input type="text" placeholder="Search..." />
      </form>
    );
  }
}

export default class UserPermissionsTable extends React.Component {

  getExpandableRows = () => {
    const rows = [];
    this.props.users.forEach((user) => {
      rows.push(<ExpandableRow user={user} key={user.id} />);
    });

    return rows;
  }

  render() {
    console.log('TABLE USER PERMISSIONS:', this.props.users);

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
        {this.getExpandableRows()}
      </Table>
    );
  }
}
