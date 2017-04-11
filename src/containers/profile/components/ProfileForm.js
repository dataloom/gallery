import React, { PropTypes } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import styles from '../styles.module.css';

const getFormItems = (content, handleChange) => {
  // TODO: Update key with item id
  const formItems = content.map((item) => {
    return (
      <div className={styles.formRow} key={item.key}>
        <ControlLabel className={styles.controlLabel}>
          {item.label}
        </ControlLabel>
        <FormControl
            className={styles.formControl}
            type="text"
            value={item.value}
            disabled />
      </div>
    );
  });

  // TODO: Make input editable once changes are able to be saved; look @ InlineEditableControl
  // <FormControl
  //     type="text"
  //     value={item.value}
  //     onChange={(e) => {
  //       return (handleChange(item.key, e.target.value));
  //     }} />

  return formItems;
};

const ProfileForm = ({ header, content, handleChange }) => {
  return (
    <form className={styles.profileFormWrapper}>
      <div className={styles.header}>
        {header}
      </div>
      <FormGroup className={styles.formGroup}>
        {getFormItems(content, handleChange)}
      </FormGroup>
    </form>
  );
};

ProfileForm.propTypes = {
  content: PropTypes.array.isRequired,
  // handleChange: PropTypes.func.isRequired
};

export default ProfileForm;
