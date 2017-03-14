import React, { PropTypes } from 'react';
import { Table } from 'react-bootstrap';
import styles from '../styles.module.css';

export default class RolePermissionsTable extends React.Component {
  getRows = () => {
    const { rolePermissions } = this.props;
    const rows = [];

    if (rolePermissions) {
      Object.keys(rolePermissions).forEach((role, i) => {
        var roleStr = role;
        if (role === 'AuthenticatedUser') {
          roleStr = 'Default for all users';
        }
        rows.push(<tr className={styles.mainRow} key={i}><td>{roleStr}</td><td>{rolePermissions[role]}</td></tr>);
      });
    }
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
        <tbody>
          {this.getRows()}
        </tbody>
      </Table>
    );
  }
}
