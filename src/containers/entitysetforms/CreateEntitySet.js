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

const ENTITY_SET_TYPES = {
  ENTITY_SET: 'Entity Set',
  LINKED_ENTITY_SET: 'Linked Entity Set'
};

const PERSON_TYPE_FQN = 'general.person';

class CreateEntitySet extends React.Component {

  static propTypes = {
    actions: PropTypes.shape({
      onCreateEntitySet: PropTypes.func.isRequired,
      fetchAllEntityTypesRequest: PropTypes.func.isRequired
    }).isRequired,
    createEntitySetAsyncState: AsyncStatePropType.isRequired,
    defaultContact: PropTypes.string,
    entityTypes: PropTypes.instanceOf(Immutable.Map).isRequired,
    entitySets: PropTypes.instanceOf(Immutable.Map).isRequired,
    isAdmin: PropTypes.bool.isRequired,
    personEntityTypeId: PropTypes.string.isRequired
  };

  constructor(props) {

    super(props);

    this.state = {
      type: ENTITY_SET_TYPES.ENTITY_SET,
      title: '',
      description: '',
      name: '',
      contact: props.defaultContact,
      entityTypeId: null,
      entitySetIds: []
    };
  }

  componentDidMount() {
    this.props.actions.fetchAllEntityTypesRequest();
  }

  onTypeChange = (option) => {
    const entityTypeId = (option.value === ENTITY_SET_TYPES.LINKED_ENTITY_SET)
      ? this.props.personEntityTypeId
      : null;
    this.setState({
      type: option.value,
      entityTypeId,
      entitySetIds: []
    });
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
    const entityTypeId = (option) ? option.value : null;
    this.setState({ entityTypeId });
  };

  onEntitySetsChange = (entitySetIds) => {
    const entityTypeId = (entitySetIds.length) ? entitySetIds[0].entityTypeId : null;
    this.setState({ entitySetIds, entityTypeId });
  }

  onSubmit = () => {

    const {
      type,
      title,
      name,
      description,
      contact,
      entityTypeId,
      entitySetIds,
      personEntityTypeId
    } = this.state;

    const linking = type === ENTITY_SET_TYPES.LINKED_ENTITY_SET;

    const entitySet = {
      title,
      name,
      description,
      linking,
      entityTypeId,
      contacts: [contact],
      linkedEntitySets: linking ? entitySetIds.map(({ value }) => value) : []
    };

    this.props.actions.onCreateEntitySet(entitySet);
  }

  getTypeOptions = () => {

    const options = [];

    Object.values(ENTITY_SET_TYPES).forEach((type) => {
      options.push({
        value: type,
        label: type
      });
    });

    return options;
  }

  getEntityTypeOptions() {

    const options = [];
    this.props.entityTypes.forEach((entityType) => {
      if (!entityType.isEmpty()) {
        options.push({
          value: entityType.get('id'),
          label: entityType.get('title')
        });
      }
    });

    return options;
  }

  getEntitySetOptions = () => {

    const options = [];

    this.props.entitySets.valueSeq().filter(entitySet => !entitySet.get('linking')).forEach((entitySet) => {
      if (!this.state.entityTypeId || this.state.entityTypeId === entitySet.get('entityTypeId')) {
        options.push({
          value: entitySet.get('id'),
          label: entitySet.get('title'),
          entityTypeId: entitySet.get('entityTypeId')
        });
      }
    });
    return options;
  }

  renderEntityTypeOrEntitySetSelection = () => {

    if (this.state.type === ENTITY_SET_TYPES.LINKED_ENTITY_SET) {
      return (
        <FormGroup>
          <ControlLabel>Entity sets</ControlLabel>
          <Select
              multi
              value={this.state.entitySetIds}
              options={this.getEntitySetOptions()}
              onChange={this.onEntitySetsChange} />
        </FormGroup>
      );
    }

    return (
      <FormGroup>
        <ControlLabel>Entity type</ControlLabel>
        <Select
            value={this.state.entityTypeId}
            options={this.getEntityTypeOptions()}
            onChange={this.onEntityTypeChange} />
      </FormGroup>
    );
  }

  renderPending = () => {
    return (
      <form onSubmit={this.onSubmit}>

        {
          this.props.isAdmin && (
            <FormGroup>
              <ControlLabel>Type</ControlLabel>
              <Select
                  value={this.state.type}
                  options={this.getTypeOptions()}
                  onChange={this.onTypeChange} />
            </FormGroup>
          )
        }

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
          <ControlLabel>Contact</ControlLabel>
          <FormControl
              type="text"
              value={this.state.contact}
              onChange={this.onContactChange} />
        </FormGroup>

        { this.renderEntityTypeOrEntitySetSelection() }

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

  const createEntitySetState = state.get('createEntitySet').toJS();
  const entityTypes = state.getIn(['edm', 'entityTypes'], Immutable.Map());
  const entitySets = state.getIn(['edm', 'entitySets'], Immutable.Map());

  let personEntityTypeId = '';
  entityTypes.valueSeq().forEach((entityType) => {
    const namespace = `${entityType.getIn(['type', 'namespace'])}`;
    const name = `${entityType.getIn(['type', 'name'])}`;
    if (`${namespace}.${name}` === PERSON_TYPE_FQN) personEntityTypeId = entityType.get('id');
  });

  return {
    entityTypes,
    entitySets,
    personEntityTypeId,
    createEntitySetAsyncState: createEntitySetState.createEntitySetAsyncState
  };
}

function mapDispatchToProps(dispatch) {

  const actions = {
    fetchAllEntityTypesRequest,
    onCreateEntitySet: createEntitySetRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateEntitySet);
