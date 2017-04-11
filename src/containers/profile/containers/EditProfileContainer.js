import React from 'react';
import DocumentTitle from 'react-document-title';

import Page from '../../../components/page/Page';
import BasicInfoForm from './BasicInfoForm';

export default class EditProfileContainer extends React.Component {

  render() {
    return (
      <DocumentTitle title="Profile">
        <Page>
          <Page.Header>
            <Page.Title>Profile</Page.Title>
          </Page.Header>
          <Page.Body>
            <BasicInfoForm />
          </Page.Body>
        </Page>
      </DocumentTitle>
    );
  }
}
