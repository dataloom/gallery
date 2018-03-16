import React from 'react';
import PropTypes from 'prop-types';

import { FormControl, FormGroup, ControlLabel, Button, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AsyncContent, { AsyncStatePropType } from '../../components/asynccontent/AsyncContent';
import { editAppRequest } from './AppActionFactory';


class EditApp extends React.Component {

  static propTypes = {
    actions: PropTypes.shape({
      onEditApp: PropTypes.func.isRequired
    }).isRequired,
    editAppAsyncState: AsyncStatePropType.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      appId: '',
      title: '',
      description: '',
      name: '',
      url: ''
    };
  }

  componentDidMount() {
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

  returnChangedItems = () => {
    //
  }

  onSubmit = () => {
    const { title, description, name, url } = this.state;
    // We need to collect only items that have been changed. AKA NOT an empty string.
    const appId = this.state.appId;

    const appData = {
      name,
      title,
      description,
      url
    };

    this.props.actions.onEditApp(appId, appData);
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
          <ControlLabel>Url</ControlLabel>
          <FormControl type="text" onChange={this.onUrlChange} />
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
          {...this.props.editAppAsyncState}
          pendingContent={this.renderPending()}
          content={this.renderSuccess} />
    );
  }

}

function mapStateToProps(state) {
  const editAppState = state.get('editApp').toJS();

  return {
    editAppAsyncState: editAppState.editAppAsyncState
  };
}

function mapDispatchToProps(dispatch) {

  const actions = {
    onEditApp: editAppRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditApp);
