import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';
import Select from 'react-select';

import { FormControl, FormGroup, ControlLabel, Button, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AsyncContent, { AsyncStatePropType } from '../../components/asynccontent/AsyncContent';
// import { fetchAllEntityTypesRequest } from '../edm/EdmActionFactory';
// import { createEntitySetRequest, createLinkedEntitySetRequest } from './CreateEntitySetActionFactories';

const APP_TYPES = {
  ENTITY_SET: 'Entity Set',
  LINKED_ENTITY_SET: 'Linked Entity Set'
};


class CreateApp extends React.Component {

  static propTypes = {
    defaultContact: PropTypes.string,
    createAppAsyncState: AsyncStatePropType.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      // type: APP_TYPES.ENTITY_SET,
      title: '',
      description: '',
      name: '',
      apptypeids: [],
      url: ''
      // contact: props.defaultContact,
      // entityTypeId: null,
      // entitySetIds: []
    };
  }

  componentDidMount() {
    // this.props.actions.fetchAllEntityTypesRequest();
  }

  // onTypeChange = (option) => {
  //   // const entityTypeId = (option.value === APP_TYPES.LINKED_ENTITY_SET) ? this.props.personEntityTypeId : null;
  //   // this.setState({
  //   //   type: option.value,
  //   //   entityTypeId,
  //   //   entitySetIds: []
  //   // });
  // }

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
      apptypeids: event.target.value
    });
  };

  // onContactChange = (event) => {
  //   this.setState({
  //     contact: event.target.value
  //   });
  // }

  // onEntityTypeChange = (option) => {
  //   const entityTypeId = (option) ? option.value : null;
  //   this.setState({ entityTypeId });
  // };
  //
  // onEntitySetsChange = (entitySetIds) => {
  //   const entityTypeId = (entitySetIds.length) ? entitySetIds[0].entityTypeId : null;
  //   this.setState({ entitySetIds, entityTypeId });
  // }

  onSubmit = () => {
    // const { type, title, name, description, contact, entityTypeId, entitySetIds } = this.state;
    //
    // const entitySet = {
    //   title,
    //   name,
    //   description,
    //   entityTypeId,
    //   contacts: [contact]
    // };
    //
    // if (type === ENTITY_SET_TYPES.ENTITY_SET) this.props.actions.onCreateEntitySet(entitySet);
    // else {
    //   const propertyTypeIds = this.props.entityTypes.getIn([entityTypeId, 'properties'], Immutable.List()).toJS();
    //   const linkingProperties = propertyTypeIds.map((propertyTypeId) => {
    //     const linkMap = {};
    //     entitySetIds.forEach((entitySetOption) => {
    //       linkMap[entitySetOption.value] = propertyTypeId;
    //     });
    //     return linkMap;
    //   });
    //   const linkingEntitySet = { entitySet, linkingProperties };
    //   this.props.actions.onCreateLinkedEntitySet({ linkingEntitySet, propertyTypeIds });
    // }
  }
  getTypeOptions = () => {

    const options = [];

    Object.values(APP_TYPES).forEach((type) => {
      options.push({
        value: type,
        label: type
      });
    });

    return options;
  }

  renderPending = () => {
    return (
      <form onSubmit={this.onSubmit}>
        {/*<FormGroup>
          <ControlLabel>Type</ControlLabel>
          <Select
              value={this.state.type}
              options={this.getTypeOptions()}
              onChange={this.onTypeChange} />
        </FormGroup>*/}

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

        {/* <FormGroup>
          <ControlLabel>Contact</ControlLabel>
          <FormControl
              type="text"
              value={this.state.contact}
              onChange={this.onContactChange} />
        </FormGroup> */}

        {/* this.renderEntityTypeOrEntitySetSelection() */}
        <br />
        <Button type="submit" bsStyle="primary">Create</Button>
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

export default (CreateApp);
