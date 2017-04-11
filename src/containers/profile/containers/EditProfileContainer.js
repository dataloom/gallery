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

// TODO: Hook up Redux; make fields editable
export default class EditProfileContainer extends React.Component {
  static propTypes = {
    // onSubmit: PropTypes.func.isRequired
  }

  // TODO: Add in submit button once hooked up to backend
  // <Button onClick={this.props.onSubmit}>Submit</Button>
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

// TODO: Separate container & component logic
// function mapStateToProps(state) {
//   return {};
// }
//
// function mapDispatchToProps(dispatch) {
//   const actions = {
//     onSubmit: actionFactory.onProfileSubmit
//   };
//
//   return bindActionCreators(actions, dispatch);
// }
//
// export default connect(mapStateToProps, mapDispatchToProps)(EditProfileContainer);
