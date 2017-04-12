import React from 'react';
import DocumentTitle from 'react-document-title';

import Page from '../../../components/page/Page';
import AvatarUpload from './AvatarUpload';
import BasicInfoForm from './BasicInfoForm';
import AccountInfoForm from './AccountInfoForm';

export default class EditProfileContainer extends React.Component {

  render() {
    return (
      <DocumentTitle title="Profile">
        <Page>
          <Page.Header>
            <Page.Title>Account</Page.Title>
          </Page.Header>
          <Page.Body>
            <AvatarUpload />
            <BasicInfoForm />
            <AccountInfoForm />
          </Page.Body>
        </Page>
      </DocumentTitle>
    );
  }
}
