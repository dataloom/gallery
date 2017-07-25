import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { Button, ButtonGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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
    entitySet: PropTypes.object.isRequired,
    propertyTypes: PropTypes.array.isRequired,
    downloadResults: PropTypes.func.isRequired,
    topUtilizersDetails: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      display: DISPLAYS.TABLE
    };
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
        </ButtonGroup>
      </div>
    );
  }

  renderResults = () => {
    if (this.state.display === DISPLAYS.TABLE) {
      return (<TopUtilizersTable
          results={this.props.results.toJS()}
          propertyTypes={this.props.propertyTypes}
          entitySetId={this.props.entitySet.id} />);
    }
    else if (this.state.display === DISPLAYS.HISTOGRAM) {
      return (<TopUtilizersHistogram
          results={this.props.results.toJS()}
          propertyTypes={this.props.propertyTypes}
          entitySetId={this.props.entitySet.id} />);
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
