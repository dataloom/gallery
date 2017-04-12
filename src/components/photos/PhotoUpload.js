import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

import StyledFlexContainer from '../flex/StyledFlexContainer';
import styles from './styles.module.css';

const PhotoUpload = ({ header, content }) => {
  return (
    <div className={styles.photoUploadWrapper}>
      <div className={styles.header}>
        {header}
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.photoWrapper}>
          {content}
        </div>
        <Button className={styles.uploadButton}>Upload photo
        </Button>
      </div>
    </div>
  );
};

PhotoUpload.propTypes = {
  header: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired
};

export default PhotoUpload;
