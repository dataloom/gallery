import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';
import Select from 'react-select';

import { FormControl, FormGroup, ControlLabel, Button, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AsyncContent, { AsyncStatePropType } from '../../components/asynccontent/AsyncContent';

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

export default (CreateApp);
