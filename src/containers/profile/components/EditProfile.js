import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Button } from 'react-bootstrap';
import styles from '../styles.module.css';

const EditProfile = ({onSubmit}) => {
  return(
    <div>
      <div>EditProfileComponent!</div>
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
};

EditProfile.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default EditProfile;
