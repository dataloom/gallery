import React, { PropTypes } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import styles from '../styles.module.css';

// TODO: Set label on left side
// TODO: Style Form
const getFormItems = (content, handleChange) => {
  // TODO: Update key with item id
  const formItems = content.map((item) => {
    return (
      <ControlLabel key={item.key}>
        {item.label}:
        <FormControl
            type="text"
            value={item.value}
            onChange={(e) => {
              return (handleChange(item.key, e.target.value));
            }} />
      </ControlLabel>
    );
  });

  return formItems;
};

const ProfileForm = ({ content, handleChange }) => {
  return (
    <form>
      <FormGroup>
        {getFormItems(content, handleChange)}
      </FormGroup>
    </form>
  );
};

ProfileForm.propTypes = {
  content: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default ProfileForm;
