import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Button } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import Page from '../../../components/page/Page';
import styles from '../styles.module.css';

const EditProfile = ({ userDetails, onSubmit }) => {
  return (
    <DocumentTitle title="Edit Profile">
      <Page>
        <Page.Header>
          <Page.Title>Edit Profile</Page.Title>
        </Page.Header>
        <div>EditProfileComponent!</div>
        <Button onClick={onSubmit}>Submit</Button>
      </Page>
    </DocumentTitle>
  );
};

EditProfile.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default EditProfile;
