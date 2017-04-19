import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SearchResultsTable from '../../entitysetsearch/EntitySetSearchResults';
import LoadingSpinner from '../../../components/asynccontent/LoadingSpinner';
import * as actionFactory from '../TopUtilizersActionFactory';

class TopUtilizersResultsContainer extends React.Component {
  static propTypes = {
    results: PropTypes.array.isRequired,
    entitySet: PropTypes.object.isRequired,
    isGettingResults: PropTypes.bool.isRequired
  }

  getPropertyTypes = () => {
    return this.props.entitySet ? this.props.entitySet.entityType.properties : [];
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
          results={this.props.results}
          propertyTypes={this.getPropertyTypes()}
          formatValueFn={this.formatValue} />
    );
  }

  renderContent = () => {
    return this.props.isGettingResults ? <LoadingSpinner /> : this.renderTable();
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
