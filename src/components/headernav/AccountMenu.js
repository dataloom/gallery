import React from 'react';

import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { hashHistory } from 'react-router';

import PageConsts from '../../utils/Consts/PageConsts';
import styles from './headernav.module.css';

const AccountMenu = ({ onLogoutClick }) => {
  return (
    <DropdownButton
        title={
          <FontAwesome name="user-o" />
        }
        pullRight
        id={styles.dropdown}
        noCaret>
      <MenuItem
          onSelect={() => {
            hashHistory.push(`/${PageConsts.EDIT_ACCOUNT}`);
          }}>
        Account
      </MenuItem>
      <MenuItem divider />
      <MenuItem onSelect={onLogoutClick}>
        Logout
      </MenuItem>
    </DropdownButton>
  );
};

AccountMenu.propTypes = {
  onLogoutClick: PropTypes.func.isRequired
};

export default AccountMenu;
