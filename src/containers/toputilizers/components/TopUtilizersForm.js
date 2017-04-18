import React from 'react';
import DocumentTitle from 'react-document-title';

import Page from '../../../components/page/Page.js';
import styles from '../styles.module.css';

const TopUtilizersForm = ({}) => {
  return (
    <DocumentTitle>
      <Page>
        <Page.Header>
          <Page.Title>Top Utilizers</Page.Title>
        </Page.Header>
        <Page.Body>
          top utilizers
        </Page.Body>
      </Page>
    </DocumentTitle>
  );
};

export default TopUtilizersForm;
