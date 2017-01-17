/*
 * @flow
 */

import React from 'react';

import styles from './loading.spinner.module.css';

export default function() {

  return (
    <div className={styles.loadingSpinnerWrapper}>
      <div className={styles.loadingSpinner} data-loader={'circle-side'} />
    </div>
  );
}
