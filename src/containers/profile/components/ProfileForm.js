import React, { PropTypes } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import styles from '../styles.module.css';

// TODO: Make this modular
// QUESTION: How to get placeholder text - set it as property on values obj?
const ProfileForm = ({ values, handleChange }) => {
  return (
    <form>
      <FormGroup>
        <ControlLabel>
            First name:
          <FormControl
              type="text"
              value={values.firstName}
              placeholder="First name"
              onChange={(e) => (handleChange('firstName', e.target.value))} />
        </ControlLabel>
        <ControlLabel>
            Last name:
          <FormControl
              type="text"
              value={values.lastName}
              placeholder="Last name"
              onChange={(e) => (handleChange('lastName', e.target.value))} />
        </ControlLabel>
        <ControlLabel>
            Email address:
          <FormControl
              type="text"
              value={values.email}
              placeholder="Email address"
              onChange={(e) => (handleChange('email', e.target.value))} />
        </ControlLabel>
      </FormGroup>
    </form>
  );
};

ProfileForm.propTypes = {
  values: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default ProfileForm;
