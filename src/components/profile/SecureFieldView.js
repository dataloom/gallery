import React from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';

import styles from './styles.module.css';

const SecureFieldView = ({ content }) => {
  return (
    <CopyToClipboard
        className={`${styles.uneditableField} ${styles.secureField}`}
        text={content.value}>
      <div>
        <div className={styles.dots}>
          {content.value.slice(0, 59)}
        </div>
        <div className={styles.copyButton}>copy
        </div>
      </div>
    </CopyToClipboard>
  );
};

SecureFieldView.propTypes = {
  content: PropTypes.object.isRequired
};

export default SecureFieldView;
