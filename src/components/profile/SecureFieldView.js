import React from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';

import styles from './styles.module.css';

const onCopyClick = (e) => {
  e.preventDefault();
  console.log('click!', e.currentTarget.dataset.value);
};

const SecureFieldView = ({ content, value, copied }) => {
  return (
    <div
        className={`${styles.uneditableField} ${styles.secureField}`}
        data-value={content.value}
        onClick={onCopyClick}>
      <div className={styles.dots}>
        {content.value.slice(0, 59)}
      </div>
      <div className={styles.copyButton}>copy
      </div>
    </div>
  );
};

SecureFieldView.propTypes = {

};

export default SecureFieldView;
