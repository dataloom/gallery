import React, { PropTypes } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import ProfileSectionWrapper from './ProfileSectionWrapper';
import SecureField from './SecureField';
import styles from './styles.module.css';

const getValueField = (item) => {
  const editable = item.editable || false;
  const secure = item.secure || false;
  if (editable) {
    return (<FormControl
        className={styles.formControl}
        type="text"
        value={item.value}
        disabled />);
  }
  if (secure) {
    return <SecureField content={item} />;
  }

  return (
    <div className={styles.uneditableField}>
      <div className={styles.uneditableFieldContent}>{item.value}</div>
    </div>
  );
};

const getFormItems = (content) => {
  const formItems = content.map((item) => {
    return (
      <div className={styles.formRow} key={item.key}>
        <ControlLabel className={styles.controlLabel}>
          {item.label}
        </ControlLabel>
        {getValueField(item)}
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
