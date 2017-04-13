import React, { PropTypes } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import ProfileSectionWrapper from './ProfileSectionWrapper';
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
    <ProfileSectionWrapper header={header}>
      <FormGroup className={styles.sectionContent}>
        {getFormItems(content)}
      </FormGroup>
    </ProfileSectionWrapper>
  );
};

ProfileForm.propTypes = {
  header: PropTypes.string.isRequired,
  content: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })).isRequired
};

export default ProfileForm;
