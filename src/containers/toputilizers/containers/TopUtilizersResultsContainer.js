import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import Promise from 'bluebird';
import Immutable from 'immutable';
import { Button, ButtonGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { EntityDataModelApi } from 'lattice';

import * as actionFactory from '../TopUtilizersActionFactory';
import TopUtilizersTable from '../components/TopUtilizersTable';
import TopUtilizersHistogram from '../components/TopUtilizersHistogram';
import TopUtilizersMultiHistogram from '../components/TopUtilizersMultiHistogram';
import LoadingSpinner from '../../../components/asynccontent/LoadingSpinner';
import styles from '../styles.module.css';

const DISPLAYS = {
  TABLE: 'table',
  HISTOGRAM: 'histogram',
  MULTI_HISTOGRAM: 'multi_histogram'
};

class TopUtilizersResultsContainer extends React.Component {
  static propTypes = {
    results: PropTypes.object.isRequired,
    isGettingResults: PropTypes.bool.isRequired,
    isGettingNeighbors: PropTypes.bool.isRequired,
    entitySet: PropTypes.object.isRequired,
    propertyTypes: PropTypes.array.isRequired,
    downloadResults: PropTypes.func.isRequired,
    topUtilizersDetails: PropTypes.instanceOf(Immutable.List).isRequired,
    neighbors: PropTypes.instanceOf(Immutable.Map).isRequired,
    entitySetPropertyMetadata: PropTypes.instanceOf(Immutable.Map).isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      entityType: null,
      propertyTypes: [],
      display: DISPLAYS.TABLE,
      neighborEntityTypes: [],
      neighborPropertyTypes: {}
    };
  }

  componentDidMount() {
    this.loadEntitySet();
    const neighborTypeIds = new Set();
    this.props.topUtilizersDetails.forEach((detailsObj) => {
      detailsObj.get('neighborTypeIds', []).forEach((id) => {
        neighborTypeIds.add(id);
      });
    });
  }

  loadEntitySet = () => {
    EntityDataModelApi.getEntityType(this.props.entitySet.entityTypeId)
    .then((entityType) => {
      Promise.map(entityType.properties, (propertyId) => {
        return EntityDataModelApi.getPropertyType(propertyId);
      }).then((propertyTypes) => {
        this.setState({ entityType, propertyTypes });
        this.loadNeighborTypes();
      });
    });
  }

  loadNeighborTypes = () => {
    const neighborTypeIds = new Set();
    this.props.topUtilizersDetails.forEach((detailsObj) => {
      detailsObj.get('neighborTypeIds', []).forEach((id) => {
        neighborTypeIds.add(id);
      });
    });
    Promise.map(neighborTypeIds, (entityTypeId) => {
      return EntityDataModelApi.getEntityType(entityTypeId);
    }).then((neighborEntityTypes) => {
      const neighborPropertyTypes = {};
      neighborEntityTypes.forEach((entityType) => {
        entityType.properties.forEach((propertyTypeId) => {
          neighborPropertyTypes[propertyTypeId] = {};
        });
      });
      Promise.map(Object.keys(neighborPropertyTypes), (propertyTypeId) => {
        return EntityDataModelApi.getPropertyType(propertyTypeId);
      }).then((propertyTypes) => {
        propertyTypes.forEach((propertyType) => {
          neighborPropertyTypes[propertyType.id] = propertyType;
        });
        this.setState({ neighborEntityTypes, neighborPropertyTypes });
      });
    });
  }

  renderDownloadButton = () => {
    return (
      <div className={styles.downloadButton}>
        <Button
            bsStyle="primary"
            onClick={() => {
              this.props.downloadResults(this.props.entitySet.id, this.props.topUtilizersDetails);
            }}>Download as CSV</Button>
      </div>
    );
  }

  renderContent = () => {
    return this.props.isGettingResults ? <LoadingSpinner /> : this.renderResultsContainer();
  }

  renderResultsContainer = () => {
    return (this.props.results.size === 0) ?
    (
      <div>No results found.</div>
    ) : (
      <div>
        {this.renderDisplayToolbar()}
        {this.renderResults()}
        {this.renderDownloadButton()}
      </div>
    );
  }

  renderDisplayToolbar = () => {
    return (
      <div className={styles.displayToolbar}>
        <ButtonGroup>
          <Button
              onClick={() => {
                this.setState({ display: DISPLAYS.TABLE });
              }}
              active={this.state.display === DISPLAYS.TABLE}>
            Table</Button>
          <Button
              onClick={() => {
                this.setState({ display: DISPLAYS.HISTOGRAM });
              }}
              active={this.state.display === DISPLAYS.HISTOGRAM}>
            Histogram</Button>
          <Button
              onClick={() => {
                this.setState({ display: DISPLAYS.MULTI_HISTOGRAM });
              }}
              active={this.state.display === DISPLAYS.MULTI_HISTOGRAM}>
            Multi-Histogram</Button>
        </ButtonGroup>
      </div>
    );
  }

  renderHistogram = () => {
    if (this.props.isGettingNeighbors) return <LoadingSpinner />;
    return (
      <TopUtilizersHistogram
          results={this.props.results.toJS()}
          propertyTypes={this.state.propertyTypes}
          entityType={this.state.entityType}
          neighborEntityTypes={this.state.neighborEntityTypes}
          neighborPropertyTypes={this.state.neighborPropertyTypes}
          neighbors={this.props.neighbors}
          entitySetPropertyMetadata={this.props.entitySetPropertyMetadata} />
    );
  }

  renderMultiHistogram = () => {
    if (this.props.isGettingNeighbors) return <LoadingSpinner />;

    const allPropertyTypes = Object.assign({}, this.state.neighborPropertyTypes);
    this.state.propertyTypes.forEach((propertyType) => {
      allPropertyTypes[propertyType.id] = propertyType;
    });

    const allEntityTypes = {};
    [this.state.entityType].concat(this.state.neighborEntityTypes).forEach((entityType) => {
      allEntityTypes[entityType.id] = entityType;
    });

    return (
      <TopUtilizersMultiHistogram
          results={this.props.results.toJS()}
          entityType={this.state.entityType}
          allEntityTypes={allEntityTypes}
          allPropertyTypes={allPropertyTypes}
          neighbors={this.props.neighbors}
          entitySetPropertyMetadata={this.props.entitySetPropertyMetadata} />
    );
  }

  renderResults = () => {
    if (this.state.display === DISPLAYS.TABLE) {
      return (<TopUtilizersTable
          results={this.props.results.toJS()}
          propertyTypes={this.props.propertyTypes}
          entitySetId={this.props.entitySet.id}
          entitySetPropertyMetadata={this.props.entitySetPropertyMetadata} />);
    }
    else if (this.state.display === DISPLAYS.HISTOGRAM) {
      return this.renderHistogram();
    }

    else if (this.state.display === DISPLAYS.MULTI_HISTOGRAM) {
      return this.renderMultiHistogram();
    }
    return null;
  }

  render() {
    return (
      <DocumentTitle title="Top Utilizers">
        {this.renderContent()}
      </DocumentTitle>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const topUtilizers = state.get('topUtilizers');
  const entitySetPropertyMetadata = state
    .getIn(['edm', 'entitySetPropertyMetadata', ownProps.entitySet.id], Immutable.Map());

  return {
    results: topUtilizers.get('topUtilizersResults'),
    isGettingResults: topUtilizers.get('isGettingResults'),
    isGettingNeighbors: topUtilizers.get('isGettingNeighbors'),
    associations: topUtilizers.get('associations'),
    topUtilizersDetails: topUtilizers.get('topUtilizersDetailsList'),
    neighbors: topUtilizers.get('neighbors'),
    entitySetPropertyMetadata
  };
}

function mapDispatchToProps(dispatch) {
  const actions = {
    downloadResults: actionFactory.downloadTopUtilizersRequest
  };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TopUtilizersResultsContainer);
