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


class CreateAppType extends React.Component {

  static propTypes = {
    defaultContact: PropTypes.string,
    createAppAsyncState: AsyncStatePropType.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      name: '',
      namespace: '',
      entityTypeId: null
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

    console.log('You clicked the Create App Type button');

    const AppType = {
      title,
      description,
      name,
      namespace,
      entityTypeId
    };
    console.log(AppType);
    // const { title, description, name, nentityTypeId } = this.state;
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

export default (CreateAppType);
