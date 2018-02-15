import React, { PropTypes } from 'react';
import Immutable from 'immutable';

import { NONE } from '../../../utils/Consts/PermissionsSummaryConsts';
import styles from '../styles.module.css';


class UserRow extends React.Component {
  static propTypes = {
    user: PropTypes.instanceOf(Immutable.Map).isRequired
  }

  getUserCellData = () => {
    const { user } = this.props;
    if (user.get('nickname')) {
      return `${user.get('nickname')} (${user.get('email')})`;
    }

    return user.get('email');
  }

  getPermissionsStr = () => {
    const { user } = this.props;
    let formattedPermissions;
    if (user.get('permissions').size === 0) {
      formattedPermissions = NONE;
    }
    else {
      formattedPermissions = user.get('permissions').join(', ');
    }

    return formattedPermissions;
  }

  render() {
    return (
      <tr className={styles.mainRow}>
        <td>{this.getUserCellData()}</td>
        <td />
        <td>{this.getPermissionsStr()}</td>
      </tr>
    );
  }
}

export default UserRow;
