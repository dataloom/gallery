import React, { PropTypes } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import styles from '../styles.module.css';

// TODO: Set label on left side
// TODO: Style Form
const getFormItems = (content, handleChange) => {
  // TODO: Update key with item id
  const formItems = content.map((item) => {
    return (
      <div className={styles.formItemWrapper} key={item.key}>
        <div className={styles.controlLabel}>
          <ControlLabel>
            {item.label}:
          </ControlLabel>
        </div>
        <div className={styles.formControl}>
          <FormControl
              type="text"
              value={item.value}
              onChange={(e) => {
                return (handleChange(item.key, e.target.value));
              }} />
        </div>
      </div>
    );
  });

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
  handleChange: PropTypes.func.isRequired
};

export default ProfileForm;








// TODO: COLUMNS FOR LABEL / INPUT
