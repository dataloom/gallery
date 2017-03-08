import React, { PropTypes } from 'react';
import { Table } from 'react-bootstrap';
import styles from '../styles.module.css';

class Header extends React.Component {
  render() {
    return(
      <tr>
        {headers}
      </tr>
    );
  }
}

class UserRow extends React.Component {
  getClassName = () => {
    // Probably want to set a classname that allows for hover behavior (expanded rows should not have hover state)
    return this.props.isCollapsed ? `${styles.expandableRow} ${styles.collapse}` : `${styles.expandableRow} ${styles.collapseOpen}`
  }

  render() {
    return (
      <tr className={this.getClassName()} onClick={this.props.toggleCollapse}>
        <td>{this.props.user.email}</td>
        <td>{this.props.user.role}</td>
        <td>{this.props.user.entityPermissions}</td>
        <td>{this.props.user.propertyAPermissions}</td>
        <td>{this.props.user.propertyBPermissions}</td>
      </tr>
    );
  }
}

class RoleRow extends React.Component {
  getClassName = () => {
    // Probably want to set a classname that allows for hover behavior (expanded rows should not have hover state)
    return this.props.isCollapsed ? `${styles.rowRow} ${styles.hidden}` : styles.rowRow;
  }

  render() {
    return (
      <tr className={this.getClassName()}>
        <td>{this.props.role.role}</td>
        <td>{this.props.role.entityPermissions}</td>
        <td>{this.props.role.propertyAPermissions}</td>
        <td>{this.props.role.propertyBPermissions}</td>
      </tr>
    );
  }
}

class TableBody extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isCollapsed: true
    }
  }

  toggleCollapse = () => {
    this.setState({isCollapsed: !this.state.isCollapsed}, () => {console.log('collapsed state:', this.state.isCollapsed)});
  }

  getRows = () => {
    var rows = [];
    var isCollapsed = this.state.isCollapsed;
    var toggleCollapse = this.toggleCollapse;
    this.props.users.forEach(function(user) {
      rows.push(<UserRow user={user} isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} key={user.id} />);
      if (user.expand.length > 0) {
        user.expand.forEach((role) => {
          rows.push(<RoleRow role={role} isCollapsed={isCollapsed} key={`${user.id}-${role.role}`}  />)
        })
      }
    });
    return rows;
  }

  render() {
    return (
      <tbody>
        {this.getRows()}
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

export default class ExpandableTable extends React.Component {
  render() {
    var headers = [];
    this.props.headers.forEach((header, i) => {
      headers.push(<th key={i}>{header}</th>)
    });

    return (
      <Table striped bordered hover responsive className={styles.expandableTable}>
        <thead>
          <tr>
            {headers}
          </tr>
        </thead>
          <TableBody users={this.props.users} />
      </Table>
    );
  }
}
