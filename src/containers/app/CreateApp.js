import React from 'react';
import PropTypes from 'prop-types';

import { FormControl, FormGroup, ControlLabel, Button, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AsyncContent, { AsyncStatePropType } from '../../components/asynccontent/AsyncContent';
import { createAppRequest } from './AppActionFactory';


class CreateApp extends React.Component {

  static propTypes = {
    actions: PropTypes.shape({
      createAppRequest: PropTypes.func.isRequired
    }).isRequired,
    createAppAsyncState: AsyncStatePropType.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      name: '',
      appTypeIds: [],
      url: ''
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
    const splitAppTypeIds = appTypeIds.split(', ');

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
          {...this.props.createAppAsyncState}
          pendingContent={this.renderPending()}
          content={this.renderSuccess} />
    );
  }

}

function mapStateToProps(state) {
  const createAppState = state.get('createApp').toJS();

  return {
    createAppAsyncState: createAppState.createAppAsyncState
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
