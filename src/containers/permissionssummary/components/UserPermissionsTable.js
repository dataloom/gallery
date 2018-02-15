import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Table } from 'react-bootstrap';
import { connect } from 'react-redux';

import UserGroupRow from './UserGroupRow';
import { AUTHENTICATED_USER } from '../../../utils/Consts/UserRoleConsts';
import styles from '../styles.module.css';


class UserPermissionsTable extends React.Component {

  static propTypes = {
    headers: PropTypes.array.isRequired,
    rolePermissions: PropTypes.instanceOf(Immutable.Map).isRequired,
    userPermissions: PropTypes.instanceOf(Immutable.List).isRequired,
    authenticatedUserPermissions: PropTypes.instanceOf(Immutable.List)
  }

  getUserGroupRows = () => {
    const { rolePermissions, userPermissions } = this.props;
    const rows = [];

    userPermissions.forEach((user) => {
      const permissions = user.get('permissions', Immutable.List());

      // If user has permissions, and they are different than the default permissions, add UserGroupRow
      if (!permissions.isEmpty()) {
        let i = 0;
        let notUnique = true;

        while (notUnique && i < permissions.size) {
          const permission = permissions.get(i);
          if (
            this.props.authenticatedUserPermissions
              && this.props.authenticatedUserPermissions.indexOf(permission) === -1
          ) {
            rows.push(
              <UserGroupRow key={user.get('id')} rolePermissions={rolePermissions} user={user} />
            );
            notUnique = false;
          }

          i += 1;
        }
      }
    });

    return rows;
  }

  render() {
    const headers = [];
    this.props.headers.forEach((header) => {
      headers.push(<th key={header}>{header}</th>);
    });

    return (
      <div>
        <Table bordered responsive className={styles.table}>
          <thead>
            <tr>
              {headers}
            </tr>
          </thead>
          { this.getUserGroupRows() }
        </Table>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    authenticatedUserPermissions: ownProps.rolePermissions.get(AUTHENTICATED_USER)
  };
}

export default connect(mapStateToProps)(UserPermissionsTable);
