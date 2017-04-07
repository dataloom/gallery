import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Button } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import Page from '../../../components/page/Page';
import ProfileForm from './ProfileForm';
import styles from '../styles.module.css';

const EditProfile = ({ userDetails, onSubmit }) => {
  return (
    <DocumentTitle title="Edit Profile">
      <Page>
        <Page.Header>
          <Page.Title>Edit Profile</Page.Title>
        </Page.Header>
        <Page.Body>
          <ProfileForm />
          <Button onClick={onSubmit}>Submit</Button>
        </Page.Body>
      </Page>
    </DocumentTitle>
  );
};

EditProfile.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default EditProfile;
