import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';
import { Button } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';

import * as actionFactory from '../ProfileActionFactory';
import Page from '../../../components/page/Page';
import BasicInfoForm from './BasicInfoForm';
import styles from '../styles.module.css';

class EditProfileContainer extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  }

  render() {
    return (
      <DocumentTitle title="Edit Profile">
        <Page>
          <Page.Header>
            <Page.Title>Edit Profile</Page.Title>
          </Page.Header>
          <Page.Body>
            <BasicInfoForm />
            <Button onClick={this.props.onSubmit}>Submit</Button>
          </Page.Body>
        </Page>
      </DocumentTitle>
    );
  }
}

// TODO: Separate container & component logic
function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  const actions = {
    onSubmit: actionFactory.onProfileSubmit
  };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileContainer);
