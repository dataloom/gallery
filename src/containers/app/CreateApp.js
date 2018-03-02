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
    defaultContact: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      type: APP_TYPES.ENTITY_SET,
      title: '',
      description: '',
      name: '',
      contact: props.defaultContact,
      entityTypeId: null,
      entitySetIds: []
    };
  }

  componentDidMount() {
    // this.props.actions.fetchAllEntityTypesRequest();
  }

  render() {
    return (
      <p>HI</p>
    );
  }

}

export default (CreateApp);
