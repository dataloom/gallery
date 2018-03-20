import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

import { FormControl, FormGroup, ControlLabel, Button, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AsyncContent from '../../components/asynccontent/AsyncContent';
import { createAppRequest } from './AppActionFactory';


class CreateApp extends React.Component {

  static propTypes = {
    actions: PropTypes.shape({
      createAppRequest: PropTypes.func.isRequired
    }).isRequired,
    createAppAsyncState: PropTypes.instanceOf(Immutable.Map).isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      name: '',
      appTypeIds: [],
      url: '',
      isError: false
    };
  }

  onTitleChange = (event) => {
    this.setState({
      title: event.target.value
    });
  };

  onNameChange = (event) => {
    this.setState({
      name: event.target.value
    });
  };

  onDescriptionChange = (event) => {
    this.setState({
      description: event.target.value
    });
  };

  onUrlChange = (event) => {
    this.setState({
      url: event.target.value
    });
  };

  onAppTypeIdsChange = (event) => {
    this.setState({
      appTypeIds: event.target.value
    });
  };

  onSubmit = () => {
    const { title, description, name, appTypeIds, url } = this.state;
    // need to separate the appTypeIds string by comma, put in array
    if (!title || !description || !name || !appTypeIds || !url) {
      // Alert! Prevent form submission
      this.setState({
        isError: true
      });
      return;
    }
    const splitAppTypeIds = appTypeIds
      .split(',')
      .map(id => id.trim())
      .filter(id => !!id);
    const app = {
      name,
      title,
      description,
      appTypeIds: splitAppTypeIds,
      url
    };

    this.props.actions.createAppRequest(app);
  }

  renderPending = () => {
    const { isError } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <FormGroup>
          <ControlLabel>Name</ControlLabel>
          <FormControl type="text" onChange={this.onNameChange} />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Title</ControlLabel>
          <FormControl type="text" onChange={this.onTitleChange} />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Description</ControlLabel>
          <FormControl componentClass="textarea" onChange={this.onDescriptionChange} />
        </FormGroup>

        <FormGroup>
          <ControlLabel>App Type Ids</ControlLabel>
          <FormControl componentClass="textarea" onChange={this.onAppTypeIdsChange} placeholder="idNumberOne, idNumberTwo, idNumberThree" />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Url</ControlLabel>
          <FormControl type="text" onChange={this.onUrlChange} />
        </FormGroup>

        <br />
        <Button type="submit" bsStyle="primary">Create App</Button>

        { isError ? (<div style={{ color: 'red' }} >
          <br />
          Please check your inputs
        </div>) : null}
      </form>
    );
  };

  renderSuccess = () => {
    return (
      <Alert bsStyle="success">
        Successfully saved App
      </Alert>
    );
  };

  render() {
    return (
      <AsyncContent
          status={this.props.createAppAsyncState.get('status')}
          errorMessage={this.props.createAppAsyncState.get('errorMessage')}
          pendingContent={this.renderPending()}
          content={this.renderSuccess} />
    );
  }

}

function mapStateToProps(state) {
  const createAppAsyncState = state.getIn(['app', 'createAppAsyncState']);

  return {
    createAppAsyncState
  };
}

function mapDispatchToProps(dispatch) {

  const actions = {
    createAppRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateApp);
