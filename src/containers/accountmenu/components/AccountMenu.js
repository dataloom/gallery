import React, { PropTypes } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { hashHistory } from 'react-router';
import PageConsts from '../../../utils/Consts/PageConsts';

import styles from '../styles.module.css';

// TODO UPDATE PAGECONSTS (profile/edit profile) here and elsewhere
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
            hashHistory.push(`/${PageConsts.LOGIN}`);
          }}>Logout
      </MenuItem>
    </DropdownButton>
  );
};

export default AccountMenu;
