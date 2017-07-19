import React from 'react';
import PropTypes from 'prop-types';
import Promise from 'bluebird';
import DocumentTitle from 'react-document-title';
import { Button, ButtonGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { EntityDataModelApi } from 'loom-data';

import * as actionFactory from '../TopUtilizersActionFactory';
import TopUtilizersTableContainer from './TopUtilizersTableContainer';
import TopUtilizersHistogramContainer from './TopUtilizersHistogramContainer';
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
      display: DISPLAYS.HISTOGRAM
    };
  }

  componentDidMount() {
    this.loadEntitySet();
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
        });
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
      return (<TopUtilizersTableContainer
          results={this.props.results.toJS()}
          propertyTypes={this.state.propertyTypes}
          entitySetId={this.props.entitySetId} />);
    }
    else if (this.state.display === DISPLAYS.HISTOGRAM) {
      return (<TopUtilizersHistogramContainer
          results={this.props.results.toJS()}
          propertyTypes={this.state.propertyTypes}
          entitySetId={this.props.entitySetId} />);
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
