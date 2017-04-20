import React, { PropTypes } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { hashHistory } from 'react-router';

import PageConsts from '../../utils/Consts/PageConsts';
import styles from './headernav.module.css';

const AccountMenu = ({ avatar, onLogoutClick }) => {
  return (
    <DropdownButton
        title={
          <span>{avatar}</span>
        }
        pullRight
        id={styles.dropdown}
        noCaret>
      <MenuItem
          onSelect={() => {
            hashHistory.push(`/${PageConsts.EDIT_ACCOUNT}`);
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

AccountMenu.propTypes = {
  avatar: PropTypes.element.isRequired,
  onLogoutClick: PropTypes.func.isRequired
};

export default AccountMenu;
