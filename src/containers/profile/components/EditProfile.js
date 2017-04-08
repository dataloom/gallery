import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { Button } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import Page from '../../../components/page/Page';
import ProfileForm from './ProfileForm';
import styles from '../styles.module.css';

const EditProfile = ({ userDetails, handleChange, onSubmit }) => {
  return (
    <DocumentTitle title="Edit Profile">
      <Page>
        <Page.Header>
          <Page.Title>Edit Profile</Page.Title>
        </Page.Header>
        <Page.Body>
          <ProfileForm
              userDetails={userDetails}
              handleChange={handleChange} />
          <Button onClick={onSubmit}>Submit</Button>
        </Page.Body>
      </Page>
    </DocumentTitle>
  );
};

EditProfile.propTypes = {
  userDetails: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default EditProfile;
