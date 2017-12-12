import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';

import * as actionFactory from '../TopUtilizersActionFactory';
import { fetchEntitySetProjectionRequest } from '../../edm/EdmActionFactory';
import { getAllEntitySetPropertyMetadataRequest } from '../../edm/EdmActionFactories';
import TopUtilizersForm from '../components/TopUtilizersForm';
import TopUtilizersResultsContainer from './TopUtilizersResultsContainer';
import PropertyTypeFilter from '../../entitysetsearch/components/PropertyTypeFilter';

class TopUtilizersFormContainer extends React.Component {
  static propTypes = {
    getEntitySetProjection: PropTypes.func.isRequired,
    getEntitySetRequest: PropTypes.func.isRequired,
    getAllEntitySetPropertyMetadata: PropTypes.func.isRequired,
    getNeighborTypes: PropTypes.func.isRequired,
    submitQuery: PropTypes.func.isRequired,
    entitySet: PropTypes.object.isRequired,
    propertyTypes: PropTypes.array.isRequired,
    topUtilizersDetailsList: PropTypes.instanceOf(Immutable.List).isRequired,
    entitySetPropertyMetadata: PropTypes.instanceOf(Immutable.Map).isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
      entitySets: [],
      showResultsTable: false,
      selectedPropertyTypes: props.propertyTypes
    };
  }

  componentDidMount() {
    this.props.getEntitySetRequest();
    this.props.getEntitySetProjection();
    this.props.getAllEntitySetPropertyMetadata();
    this.props.getNeighborTypes();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.propertyTypes.length !== nextProps.propertyTypes.length) {
      this.setState({ selectedPropertyTypes: nextProps.propertyTypes });
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.submitQuery(this.props.params.id, this.props.topUtilizersDetailsList.toJS());
    this.setState({ showResultsTable: true });
  }

  renderResultsContainer = () => {
    if (!this.state.showResultsTable) return null;
    return (
      <TopUtilizersResultsContainer entitySet={this.props.entitySet} propertyTypes={this.state.selectedPropertyTypes} />
    );
  }

  renderPropertyTypeFilter = () => {
    return (
      <PropertyTypeFilter
          propertyTypes={this.props.propertyTypes}
          entitySetPropertyMetadata={this.props.entitySetPropertyMetadata}
          onListUpdate={(selectedPropertyTypes) => {
            this.setState({ selectedPropertyTypes });
          }} />
    );
  }

  render() {
    return (
      <div>
        <TopUtilizersForm
            onSubmit={this.onSubmit}
            entitySet={this.props.entitySet} />
        <br />
        {this.renderPropertyTypeFilter()}
        {this.renderResultsContainer()}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const edm = state.get('edm');
  const entitySet = edm.getIn(['entitySets', ownProps.params.id], Immutable.Map()).toJS();
  const entityType = edm.getIn(['entityTypes', entitySet.entityTypeId], Immutable.Map());
  const propertyTypes = [];
  const propertyTypeIds = entityType.get('properties');
  if (propertyTypeIds) {
    propertyTypeIds.forEach((propertyTypeId) => {
      const propertyType = edm.getIn(['propertyTypes', propertyTypeId], undefined);
      if (propertyType) propertyTypes.push(propertyType.toJS());
    });
  }
  const topUtilizersDetailsList = state.getIn(['topUtilizers', 'topUtilizersDetailsList'], Immutable.List());

  const entitySetPropertyMetadata = state
    .getIn(['edm', 'entitySetPropertyMetadata', ownProps.params.id], Immutable.Map());

  return { entitySet, propertyTypes, topUtilizersDetailsList, entitySetPropertyMetadata };
}

function mapDispatchToProps(dispatch, ownProps) {
  const actions = {
    getEntitySetRequest: () => {
      dispatch(actionFactory.getEntitySetRequest(ownProps.params.id));
    },
    submitQuery: (id, details) => {
      dispatch(actionFactory.submitTopUtilizersRequest(id, details));
    },
    getEntitySetProjection: () => {
      dispatch(fetchEntitySetProjectionRequest([{
        type: 'EntitySet',
        id: ownProps.params.id,
        include: ['EntitySet', 'EntityType', 'PropertyTypeInEntitySet']
      }]));
    },
    getAllEntitySetPropertyMetadata: () => {
      dispatch(getAllEntitySetPropertyMetadataRequest(ownProps.params.id));
    },
    getNeighborTypes: () => {
      dispatch(actionFactory.getNeighborTypesRequest(ownProps.params.id));
    }
  };

  return actions;
}

export default connect(mapStateToProps, mapDispatchToProps)(TopUtilizersFormContainer);
