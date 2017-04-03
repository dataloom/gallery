import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Table } from 'react-bootstrap';
import styles from '../styles.module.css';

export default class RolePermissionsTable extends React.Component {
  static propTypes = {
    rolePermissions: PropTypes.instanceOf(Immutable.Map).isRequired,
    headers: PropTypes.array.isRequired
  }

  getRows = () => {
    const { rolePermissions } = this.props;
    const rows = [];

    if (rolePermissions) {
      // Object.keys(rolePermissions).forEach((role) => {
      rolePermissions.keySeq().forEach((role) => {
        const permissionsStr = rolePermissions.get(role).join(', ');

        let roleStr = role;
        if (role === 'AuthenticatedUser') {
          roleStr = 'Default for all users';
        }

        rows.push(<tr className={styles.mainRow} key={role}><td>{roleStr}</td><td>{permissionsStr}</td></tr>);
      });
    }
    return rows;
  }

  render() {
    const headers = [];
    this.props.headers.forEach((header) => {
      headers.push(<th key={header}>{header}</th>);
    });

    return (
      <Table bordered responsive className={styles.table}>
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
