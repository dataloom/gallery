import React from 'react';
import PropTypes from 'prop-types';
import SearchResultsTable from '../../entitysetsearch/EntitySetSearchResults';

export default class TopUtilizersTable extends React.Component {
  static propTypes = {
    results: PropTypes.array.isRequired,
    propertyTypes: PropTypes.array.isRequired,
    entitySetId: PropTypes.string.isRequired
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

  render() {
    if (this.props.propertyTypes.length === 0) return null;
    return (
      <SearchResultsTable
          results={this.props.results}
          propertyTypes={this.props.propertyTypes}
          formatValueFn={this.formatValue}
          entitySetId={this.props.entitySetId}
          showCount />
    );
  }
}
