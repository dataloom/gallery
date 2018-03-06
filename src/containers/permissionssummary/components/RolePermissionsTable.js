import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Table } from 'react-bootstrap';
import { AUTHENTICATED_USER } from '../../../utils/Consts/UserRoleConsts';
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
      rolePermissions.keySeq().forEach((role) => {
        let permissionsStr = rolePermissions.get(role).join(', ');

        let roleStr = role;
        if (role === AUTHENTICATED_USER) {
          roleStr = 'OpenLattice User Role - Default for all users*';
          permissionsStr = 'None';
        }

        rows.push(
          <tr className={`${styles.mainRow} roleRow`} key={role}>
            <td>{roleStr}</td>
            <td>{permissionsStr}</td>
          </tr>
        );
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
