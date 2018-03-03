import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';
import Select from 'react-select';

import { FormControl, FormGroup, ControlLabel, Button, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AsyncContent, { AsyncStatePropType } from '../../components/asynccontent/AsyncContent';
// import { createAppRequest } from './CreateAppActionFactories';

class CreateApp extends React.Component {

  static propTypes = {
    createAppAsyncState: AsyncStatePropType.isRequired,
    actions: PropTypes.shape({
      onCreateApp: PropTypes.func.isRequired
    }).isRequired
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

  componentDidMount() {
    // this.props.actions.fetchAllEntityTypesRequest();
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

    console.log('You clicked the Create App button');

    const App = {
      title,
      description,
      name,
      appTypeIds,
      url
    };
    console.log(App);

    // this.props.actions.onCreateApp(App);
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
          <FormControl componentClass="textarea" onChange={this.onAppTypeIdsChange} />
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

function mapDispatchToProps(dispatch) {

  const actions = {
    onCreateApp: createAppRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default (CreateApp);
