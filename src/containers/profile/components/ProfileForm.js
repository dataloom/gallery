import React, { PropTypes } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import styles from '../styles.module.css';

const ProfileForm = ({ userDetails, handleChange }) => {
  return (
    <form>
      <FormGroup>
        <ControlLabel>
            First name:
          <FormControl
              type="text"
              value={userDetails.firstName}
              placeholder="First name"
              onChange={(e) => (handleChange('firstName', e.target.value))} />
        </ControlLabel>
        <ControlLabel>
            Last name:
          <FormControl
              type="text"
              value={userDetails.lastName}
              placeholder="Last name"
              onChange={(e) => (handleChange('lastName', e.target.value))} />
        </ControlLabel>
        <ControlLabel>
            Email address:
          <FormControl
              type="text"
              value={userDetails.email}
              placeholder="Email address"
              onChange={(e) => (handleChange('email', e.target.value))} />
        </ControlLabel>
      </FormGroup>
    </form>
  );
};

ProfileForm.propTypes = {

};

export default ProfileForm;
