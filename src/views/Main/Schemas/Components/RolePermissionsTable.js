import React, { PropTypes } from 'react';
import { Table } from 'react-bootstrap';
import styles from '../styles.module.css';

export default class RolePermissionsTable extends React.Component {
  getRows = () => {
    const {roles} = this.props;
    var rows = [];

    if (roles) {
      Object.keys(roles).forEach((role, i) => {
        rows.push(<tr key={i}><td>{role}</td><td>{roles[role]}</td></tr>);
      });
    }
    return rows;
  }

  render() {
    var headers = [];
    this.props.headers.forEach((header, i) => {
      headers.push(<th key={i}>{header}</th>)
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
