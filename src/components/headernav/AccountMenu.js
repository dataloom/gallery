import React, { PropTypes } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import PageConsts from '../../utils/Consts/PageConsts';

import styles from './headernav.module.css';

const AccountMenu = ({ onLogoutClick }) => {
  return (
    <DropdownButton
        title={
          <span><FontAwesome name="cog" /></span>
        }
        pullRight
        id={styles.dropdown}
        noCaret>
      <MenuItem
          onSelect={() => {
            hashHistory.push(`/${PageConsts.EDIT_PROFILE}`);
          }}>Profile
      </MenuItem>
      <MenuItem divider />
      <MenuItem
          onSelect={() => {
            onLogoutClick();
          }}>Logout
      </MenuItem>
    </DropdownButton>
  );
};

export default AccountMenu;
