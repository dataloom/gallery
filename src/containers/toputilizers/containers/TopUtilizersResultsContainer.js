import React from 'react';
import PropTypes from 'prop-types';
import Promise from 'bluebird';
import DocumentTitle from 'react-document-title';
import { Button, ButtonGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { EntityDataModelApi } from 'loom-data';

import * as actionFactory from '../TopUtilizersActionFactory';
import TopUtilizersTable from '../components/TopUtilizersTable';
import TopUtilizersHistogram from '../components/TopUtilizersHistogram';
import LoadingSpinner from '../../../components/asynccontent/LoadingSpinner';
import styles from '../styles.module.css';

const DISPLAYS = {
  TABLE: 'table',
  HISTOGRAM: 'histogram'
};

class TopUtilizersResultsContainer extends React.Component {
  static propTypes = {
    results: PropTypes.object.isRequired,
    isGettingResults: PropTypes.bool.isRequired,
    entitySetId: PropTypes.string.isRequired,
    downloadResults: PropTypes.func.isRequired,
    topUtilizersDetails: PropTypes.object.isRequired
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
    Object.values(this.props.topUtilizersDetails).forEach((detailsObj) => {
      detailsObj.neighborTypeIds.forEach((id) => {
        neighborTypeIds.add(id);
      });
    });
  }

  loadEntitySet = () => {
    EntityDataModelApi.getEntitySet(this.props.entitySetId)
    .then((entitySet) => {
      EntityDataModelApi.getEntityType(entitySet.entityTypeId)
      .then((entityType) => {
        Promise.map(entityType.properties, (propertyId) => {
          return EntityDataModelApi.getPropertyType(propertyId);
        }).then((propertyTypes) => {
          this.setState({ entityType, propertyTypes });
          this.loadNeighborTypes();
        });
      });
    });
  }

  loadNeighborTypes = () => {
    const neighborTypeIds = new Set();
    Object.values(this.props.topUtilizersDetails).forEach((detailsObj) => {
      detailsObj.neighborTypeIds.forEach((id) => {
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
              this.props.downloadResults(this.props.entitySetId, this.props.topUtilizersDetails);
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
        </ButtonGroup>
      </div>
    );
  }

  renderResults = () => {
    if (this.state.display === DISPLAYS.TABLE) {
      return (<TopUtilizersTable
          results={this.props.results.toJS()}
          propertyTypes={this.state.propertyTypes}
          entitySetId={this.props.entitySetId} />);
    }
    else if (this.state.display === DISPLAYS.HISTOGRAM) {
      return (<TopUtilizersHistogram
          results={this.props.results.toJS()}
          propertyTypes={this.state.propertyTypes}
          entitySetId={this.props.entitySetId}
          entityType={this.state.entityType}
          neighborEntityTypes={this.state.neighborEntityTypes}
          neighborPropertyTypes={this.state.neighborPropertyTypes}
          topUtilizersDetails={this.props.topUtilizersDetails} />);
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

function mapStateToProps(state) {
  const topUtilizers = state.get('topUtilizers');

  return {
    results: topUtilizers.get('topUtilizersResults'),
    isGettingResults: topUtilizers.get('isGettingResults'),
    associations: topUtilizers.get('associations'),
    topUtilizersDetails: topUtilizers.get('topUtilizersDetailsList').toJS()
  };
}

function mapDispatchToProps(dispatch) {
  const actions = {
    downloadResults: actionFactory.downloadTopUtilizersRequest
  };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TopUtilizersResultsContainer);
