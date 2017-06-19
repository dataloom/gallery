/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';
import Select from 'react-select';

import { FormControl, FormGroup, ControlLabel, Button, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AsyncContent, { AsyncStatePropType } from '../../components/asynccontent/AsyncContent';
import { fetchAllEntityTypesRequest } from '../edm/EdmActionFactory';
import { createEntitySetRequest } from './CreateEntitySetActionFactories';


class CreateEntitySet extends React.Component {

  static propTypes = {
    actions: PropTypes.shape({
      onCreate: PropTypes.func.isRequired,
      fetchAllEntityTypesRequest: PropTypes.func.isRequired
    }).isRequired,
    createEntitySetAsyncState: AsyncStatePropType.isRequired,
    defaultContact: PropTypes.string,
    entityTypes: PropTypes.instanceOf(Immutable.Map).isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      name: '',
      contact: props.defaultContact,
      entityTypeId: null
    }
  }

  componentDidMount() {
    this.props.actions.fetchAllEntityTypesRequest();
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

  onContactChange = (event) => {
    this.setState({
      contact: event.target.value
    });
  }

  onEntityTypeChange = (option) => {
    this.setState({
      entityTypeId: option.value
    });
  };

  onSubmit = () => {
    const { title, name, description, entityTypeId, contact } = this.state;

    this.props.actions.onCreate({
      title,
      name,
      description,
      entityTypeId,
      contacts: [contact]
    });
  };

  getEntityTypeOptions() {

    const options = [];
    this.props.entityTypes.forEach((entityType :Map) => {
      if (!entityType.isEmpty()) {
        options.push({
          value: entityType.get('id'),
          label: entityType.get('title')
        });
      }
    });

    return options;
  }

  renderPending = () => {
    return (
      <form onSubmit={this.onSubmit}>
        <FormGroup>
          <ControlLabel>Title</ControlLabel>
          <FormControl type="text" onChange={this.onTitleChange} />
        </FormGroup>


        <FormGroup>
          <ControlLabel>Name</ControlLabel>
          <FormControl type="text" onChange={this.onNameChange} />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Description</ControlLabel>
          <FormControl componentClass="textarea" onChange={this.onDescriptionChange} />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Owner Contact</ControlLabel>
          <FormControl
              type="text"
              value={this.state.contact}
              onChange={this.onContactChange} />
        </FormGroup>

        <FormGroup>
          <ControlLabel>Entity type</ControlLabel>
          <Select
              value={this.state.entityTypeId}
              options={this.getEntityTypeOptions()}
              onChange={this.onEntityTypeChange} />
        </FormGroup>
        <Button type="submit" bsStyle="primary">Create</Button>
      </form>
    );
  };

  renderSuccess = () => {
    return (
      <Alert bsStyle="success">
        Successfully saved Dataset
      </Alert>
    );
  };

  render() {
    return (
      <AsyncContent
          {...this.props.createEntitySetAsyncState}
          pendingContent={this.renderPending()}
          content={this.renderSuccess} />
    );
  }
}

function mapStateToProps(state) {

  // const normalizedData = state.get('normalizedData').toJS(),
  const createEntitySetState = state.get('createEntitySet').toJS();

  const entityTypes :Map = state.getIn(['edm', 'entityTypes'], Immutable.Map());

  return {
    entityTypes,
    createEntitySetAsyncState: createEntitySetState.createEntitySetAsyncState
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  const actions = {
    fetchAllEntityTypesRequest,
    onCreate: createEntitySetRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateEntitySet);
