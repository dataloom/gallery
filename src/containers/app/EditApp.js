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
      editAppRequest: PropTypes.func.isRequired
    }).isRequired,
    editAppAsyncState: AsyncStatePropType.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
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

  onSubmit = () => {
    const { title, description, name, url } = this.state;

    // We need to collect only items that have been changed. AKA NOT an empty string.
    // Having issues with this because of js and iterables.
    // Collect the items, check each for change, add changed to appData object.
    const tempMap = new Map([['title', title], ['description', description], ['name', name], ['url', url]]);
    const keys = tempMap.keys();
    const appData = {};

    for (const item of keys) {
      if (tempMap.get(item) !== '') {
        appData[item] = tempMap.get(item);
      }
    }

    const appId = this.props.id;
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
    editAppRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditApp);
