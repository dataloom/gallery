import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

import { FormControl, FormGroup, ControlLabel, Button, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AsyncContent from '../../components/asynccontent/AsyncContent';
import { createAppTypeRequest } from './AppActionFactory';


class CreateAppType extends React.Component {

  static propTypes = {
    actions: PropTypes.shape({
      createAppTypeRequest: PropTypes.func.isRequired
    }).isRequired,
    createAppTypeAsyncState: PropTypes.instanceOf(Immutable.Map).isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      name: '',
      namespace: '',
      entityTypeId: null,
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

  onNamespaceChange = (event) => {
    this.setState({
      namespace: event.target.value
    });
  };

  onDescriptionChange = (event) => {
    this.setState({
      description: event.target.value
    });
  };

  onEntityTypeIdChange = (event) => {
    this.setState({
      entityTypeId: event.target.value
    });
  }

  onSubmit = () => {
    const { title, description, name, namespace, entityTypeId } = this.state;
    // Checks to make sure that required fields are not empty.
    if (!title || !description || !name || !namespace || !entityTypeId) {
      // Alert! Prevent form submission
      this.setState({
        isError: true
      });
      return;
    }
    const appType = {
      type: {
        namespace,
        name
      },
      title,
      description,
      entityTypeId
    };

    this.props.actions.createAppTypeRequest(appType);
  }

  renderPending = () => {
    const { isError } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <FormGroup>
          <ControlLabel>Namespace</ControlLabel>
          <FormControl type="text" onChange={this.onNamespaceChange} />
        </FormGroup>

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
          <ControlLabel>Entity Type Id</ControlLabel>
          <FormControl type="text" onChange={this.onEntityTypeIdChange} />
        </FormGroup>

        <br />
        <Button type="submit" bsStyle="primary">Create App Type</Button>
        { isError ? (<p style={{ color: 'red' }} >
          Please check your inputs
        </p>) : null}
      </form>
    );
  };

  renderSuccess = () => {
    return (
      <Alert bsStyle="success">
        Successfully saved App Type
      </Alert>
    );
  };

  render() {
    return (
      <AsyncContent
          status={this.props.createAppTypeAsyncState.get('status')}
          errorMessage={this.props.createAppTypeAsyncState.get('errorMessage')}
          pendingContent={this.renderPending()}
          content={this.renderSuccess} />
    );
  }

}

function mapStateToProps(state) {
  const createAppTypeAsyncState = state.getIn(['app', 'createAppTypeAsyncState']);

  return {
    createAppTypeAsyncState
  };
}

function mapDispatchToProps(dispatch) {

  const actions = {
    createAppTypeRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAppType);
