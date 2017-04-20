import React, { PropTypes } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import styles from './styles.module.css';

const getFormItems = (content) => {
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

  return formItems;
};

const ProfileForm = ({ header, content }) => {
  return (
    <form className={styles.profileFormWrapper}>
      <div className={styles.header}>
        {header}
      </div>
      <FormGroup className={styles.formGroup}>
        {getFormItems(content)}
      </FormGroup>
    </form>
  );
};

ProfileForm.propTypes = {
  header: PropTypes.string.isRequired,
  content: PropTypes.array.isRequired
};

export default ProfileForm;
