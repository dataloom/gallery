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
      appTypeIds: [],
      description: '',
      isError: false,
      name: '',
      title: '',
      url: ''
    };
  }

  onTitleChange = (event) => {
    this.setState({
      title: event.target.value.trim()
    });
  };

  onNameChange = (event) => {
    this.setState({
      name: event.target.value.trim()
    });
  };

  onDescriptionChange = (event) => {
    this.setState({
      description: event.target.value.trim()
    });
  };

  onUrlChange = (event) => {
    this.setState({
      url: event.target.value.trim()
    });
  };

  onAppTypeIdsChange = (event) => {
    this.setState({
      appTypeIds: event.target.value
    });
  };

  onSubmit = () => {
    // TODO: Utilize Models and Model Builders
    const { title, description, name, appTypeIds, url } = this.state;

    if (!title || !description || !name || !appTypeIds || !url) {
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
      description,
      name,
      title,
      url,
      appTypeIds: splitAppTypeIds
    };

    this.props.actions.createAppRequest(app);
  }

  renderPending = () => {
    // TODO: Change text area for Id inputs into a Multiple Select once endpoint is available
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
          content={this.renderSuccess}
          errorMessage={this.props.createAppAsyncState.get('errorMessage')}
          pendingContent={this.renderPending()}
          status={this.props.createAppAsyncState.get('status')} />
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
