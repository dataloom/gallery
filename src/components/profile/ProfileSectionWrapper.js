import React, { PropTypes } from 'react';
import styles from './styles.module.css';

const ProfileSectionWrapper = ({ header, ...props }) => {
  return (
    <form className={styles.profileFormWrapper}>
      <div className={styles.header}>
        {header}
      </div>
      <div className={styles.sectionContent}>
        {props.children}
      </div>
    </form>
  );
};

ProfileSectionWrapper.propTypes = {
  header: PropTypes.string.isRequired
};

export default ProfileSectionWrapper;
