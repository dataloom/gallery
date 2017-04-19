import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SearchResultsTable from '../../entitysetsearch/EntitySetSearchResults';
import LoadingSpinner from '../../../components/asynccontent/LoadingSpinner';
import * as actionFactory from '../TopUtilizersActionFactory';

class TopUtilizersResultsContainer extends React.Component {
  static propTypes = {
    results: PropTypes.array.isRequired,
    propertyTypes: PropTypes.array.isRequired,
    formatValueFn: PropTypes.func.isRequired,
    isGettingResults: PropTypes.bool.isRequired
  }

  getResults = () => {
    const dummyResults = {
      
    };
    return dummyResults;
  }

  getPropertyTypes = () => {
    return this.props.entitySet.entityType.properties;
  }

  formatValue = (rawValue) => {
    if (rawValue instanceof Array) {
      let formattedValue = '';
      if (rawValue.length > 0) formattedValue = formattedValue.concat(rawValue[0]);
      if (rawValue.length > 1) {
        for (let i = 1; i < rawValue.length; i += 1) {
          formattedValue = formattedValue.concat(', ').concat(rawValue[i]);
        }
      }
      return formattedValue;
    }
    return rawValue;
  }

  renderTable = () => {
    return (
      <SearchResultsTable
          results={this.getResults()}
          propertyTypes={this.getPropertyTypes()}
          formatValueFn={this.formatValueFn} />
    );
  }

  renderContent = () => {
    // return this.props.isGettingResults ? <LoadingSpinner /> : this.renderTable();
    return this.renderTable();
  }

  render() {
    return this.renderContent();
  }
}

function mapStateToProps(state) {
  const topUtilizers = state.get('topUtilizers');

  return {
    results: topUtilizers.get('topUtilizersResults'),
    isGettingResults: topUtilizers.get('isGettingResults'),
    associations: topUtilizers.get('associations'),
    entitySet: topUtilizers.get('entitySet')
  };
}

function mapDispatchToProps(dispatch) {
  const actions = {

  };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TopUtilizersResultsContainer);
