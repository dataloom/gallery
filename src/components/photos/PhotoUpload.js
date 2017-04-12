import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

import styles from './styles.module.css';

const PhotoUpload = ({ header, content }) => {
  console.log('content:', content);
  return (
    <form className={styles.profileFormWrapper}>
      <div className={styles.header}>
        {header}
      </div>
      <div className={styles.photoWrapper}>
        {content}
      </div>
      <Button className={styles.uploadButton}>Upload photo
      </Button>
    </form>
  );
};

PhotoUpload.propTypes = {
  header: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired
};

export default PhotoUpload;


// <image src={content} className={styles.photo}></image>
