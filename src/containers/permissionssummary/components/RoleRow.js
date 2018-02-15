import React, { PropTypes } from 'react';
import Immutable from 'immutable';

import { NONE } from '../../../utils/Consts/PermissionsSummaryConsts';
import styles from '../styles.module.css';


class RoleRow extends React.Component {
  static propTypes = {
    permissions: PropTypes.instanceOf(Immutable.List),
    role: PropTypes.string.isRequired
  }

  getPermissions = () => {
    const { permissions } = this.props;
    if (permissions && permissions.size > 0) {
      return permissions.join(', ');
    }
    return NONE;
  }

  render() {
    const { role } = this.props;
    return (
      <tr className={styles.subRow}>
        <td />
        <td>{role}</td>
        <td>{this.getPermissions()}</td>
      </tr>
    );
  }
}

export default RoleRow;
