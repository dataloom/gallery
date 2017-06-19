/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import Select from 'react-select';

import { FormGroup, InputGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  fetchAllEntityTypesRequest,
  fetchAllPropertyTypesRequest
} from '../edm/EdmActionFactory';

import styles from './securableobject.module.css';

export const FilterParamsPropType = PropTypes.shape({
  searchTerm: PropTypes.string,
  propertyTypeIds: PropTypes.arrayOf(React.PropTypes.string),
  entityTypeId: PropTypes.string,
  page: PropTypes.string
});

class SecurableObjectSearch extends React.Component {

  static propTypes = {
    actions: PropTypes.shape({
      fetchAllEntityTypesRequest: PropTypes.func.isRequired,
      fetchAllPropertyTypesRequest: PropTypes.func.isRequired
    }).isRequired,
    entityTypes: PropTypes.instanceOf(Immutable.Map).isRequired,
    propertyTypes: PropTypes.instanceOf(Immutable.Map).isRequired,
    filterParams: FilterParamsPropType,
    onSubmit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = Object.assign({
      searchTerm: '',
      propertyTypeIds: [],
      entityTypeId: ''
    }, this.props.filterParams);
  }

  componentDidMount() {

    this.props.actions.fetchAllEntityTypesRequest();
    this.props.actions.fetchAllPropertyTypesRequest();
  }

  onSearchTermChange = (event) => {
    this.setState({
      searchTerm: event.target.value
    });
  };

  onPropertyTypesChange = (options) => {
    this.setState({
      propertyTypeIds: options.map(option => option.value)
    });
  };

  onEntityTypeChange = (option) => {
    this.setState({
      entityTypeId: option ? option.value : null
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { searchTerm, propertyTypeIds, entityTypeId } = this.state;
    const filterParams = {};

    if (searchTerm) {
      filterParams.searchTerm = searchTerm;
    }
    if (propertyTypeIds && propertyTypeIds.length > 0) {
      filterParams.propertyTypeIds = propertyTypeIds;
    }
    if (entityTypeId) {
      filterParams.entityTypeId = entityTypeId;
    }
    filterParams.page = 1;
    this.props.onSubmit(filterParams);
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

  getPropertyTypeOptions() {

    const options = [];
    this.props.propertyTypes.forEach((propertyType :Map) => {
      if (!propertyType.isEmpty()) {
        options.push({
          value: propertyType.get('id'),
          label: propertyType.get('title')
        });
      }
    });

    return options;
  }

  render() {
    return (
      <form onSubmit={this.onSubmit} className={styles.search}>
        <FormGroup className={styles.searchTerm}>
          <ControlLabel>Search Term</ControlLabel>
          <InputGroup>
            <InputGroup.Addon><FontAwesome name="search"/></InputGroup.Addon>
            <FormControl
              value={this.state.searchTerm}
              type="text"
              onChange={this.onSearchTermChange}
            />
          </InputGroup>
        </FormGroup>

        <FormGroup className={styles.propertyTypes}>
          <ControlLabel>Property types</ControlLabel>
          <Select
            value={this.state.propertyTypeIds}
            options={this.getPropertyTypeOptions()}
            onChange={this.onPropertyTypesChange}
            multi={true}
          />
        </FormGroup>

        <span className={styles.divider}>Or</span>

        <FormGroup className={styles.entityType}>
          <ControlLabel>Entity type</ControlLabel>
          <Select
            value={this.state.entityTypeId}
            options={this.getEntityTypeOptions()}
            onChange={this.onEntityTypeChange}
          />
        </FormGroup>

        <Button type="submit" bsStyle="primary" className={styles.submitButton}>Search</Button>
      </form>
    );
  }
}

function mapStateToProps(state :Immutable.Map) :Object {

  return {
    entityTypes: state.getIn(['edm', 'entityTypes']),
    propertyTypes: state.getIn(['edm', 'propertyTypes'])
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  const actions = {
    fetchAllEntityTypesRequest,
    fetchAllPropertyTypesRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(SecurableObjectSearch);
