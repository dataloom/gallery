import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

import { FormControl, FormGroup, ControlLabel, Button, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AsyncContent from '../../components/asynccontent/AsyncContent';
import { editAppRequest } from './AppActionFactory';


class EditApp extends React.Component {

  static propTypes = {
    actions: PropTypes.shape({
      editAppRequest: PropTypes.func.isRequired
    }).isRequired,
    description: PropTypes.string.isRequired,
    editAppAsyncState: PropTypes.instanceOf(Immutable.Map).isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      description: '',
      name: '',
      title: '',
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

  onSubmit = () => {
    // TODO: Utilize Models and Model Builders
    const { title, description, name, url } = this.state;
    const appData = {};
    const appId = this.props.id;

    // Collect only items that have been changed. AKA NOT an empty string.
    if (title && title.length > 0) {
      appData['title'] = title;
    }
    if (description && description.length > 0) {
      appData['description'] = description;
    }
    if (name && name.length > 0) {
      appData['name'] = name;
    }
    if (url && url.length > 0) {
      appData['url'] = url;
    }

    this.props.actions.editAppRequest(appId, appData);
  }

  renderPending = () => {
    return (
      <form onSubmit={this.onSubmit}>
        <FormGroup>
          <ControlLabel>Name</ControlLabel>
          <FormControl type="text" onChange={this.onNameChange} placeholder={this.props.name} />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Title</ControlLabel>
          <FormControl type="text" onChange={this.onTitleChange} placeholder={this.props.title} />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Description</ControlLabel>
          <FormControl componentClass="textarea" onChange={this.onDescriptionChange} placeholder={this.props.description} />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Url</ControlLabel>
          <FormControl type="text" onChange={this.onUrlChange} placeholder={this.props.url} />
        </FormGroup>

        <br />
        <Button type="submit" bsStyle="primary">Update App</Button>
      </form>
    );
  };

  renderSuccess = () => {
    return (
      <Alert bsStyle="success">
        Successfully saved changes
      </Alert>
    );
  };

  render() {
    return (
      <AsyncContent
          content={this.renderSuccess}
          errorMessage={this.props.editAppAsyncState.get('errorMessage')}
          pendingContent={this.renderPending()}
          status={this.props.editAppAsyncState.get('status')} />
    );
  }

}

function mapStateToProps(state) {
  const editAppAsyncState = state.getIn(['app', 'editAppAsyncState']);

  return {
    editAppAsyncState
  };
}

function mapDispatchToProps(dispatch) {

  const actions = {
    editAppRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditApp);
