import React, { PropTypes } from 'react';
import { Table } from 'react-bootstrap';
import styles from '../styles.module.css';

export default class RolePermissionsTable extends React.Component {
  static propTypes = {
    rolePermissions: PropTypes.object.isRequired, // fix formatting to empty string from earlier in the flow
    headers: PropTypes.array.isRequired
  }

  getRows = () => {
    const { rolePermissions } = this.props;
    const rows = [];

    if (rolePermissions) {
      Object.keys(rolePermissions).forEach((role, i) => {
        const permissionsStr = rolePermissions[role].join(', ');

        let roleStr = role;
        if (role === 'AuthenticatedUser') {
          roleStr = 'Default for all users';
        }

        rows.push(<tr className={styles.mainRow}><td>{roleStr}</td><td>{permissionsStr}</td></tr>);
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
