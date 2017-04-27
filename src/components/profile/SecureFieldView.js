import React from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Button } from 'react-bootstrap';

import styles from './styles.module.css';

const SecureFieldView = ({ content }) => {
  return (
    <CopyToClipboard
        className={`${styles.uneditableField} ${styles.secureField}`}
        text={content.value}>
      <div>
        <div className={styles.dots}>
          {content.value.slice(0, 42)}
        </div>
        <Button bsSize="xs" className={styles.copyButton}>copy</Button>
      </div>
    </CopyToClipboard>
  );
};

SecureFieldView.propTypes = {
  content: PropTypes.object.isRequired
};

export default SecureFieldView;
