import React, { PropTypes } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import styles from './styles.module.css';

// const getItems = (content) => {
//   return content.map((item) => {
//     console.log('item:', item);
//
//     return (
//       <div className={styles.profileSectionItem}>
//       {}
//       </div>
//     )
//   });
// }

const ProfileSection = ({ header, content }) => {
  return (
    <form className={styles.profileFormWrapper}>
      <div className={styles.header}>
        {header}
      </div>
      <FormGroup className={styles.formGroup}>
        {content}
      </FormGroup>
    </form>
  );
};

ProfileSection.propTypes = {
  header: PropTypes.string.isRequired,
  content: PropTypes.array.isRequired
};

export default ProfileSection;
