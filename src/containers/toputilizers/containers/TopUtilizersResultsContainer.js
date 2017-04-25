import React, { PropTypes } from 'react';
import Promise from 'bluebird';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { EntityDataModelApi } from 'loom-data';

import SearchResultsTable from '../../entitysetsearch/EntitySetSearchResults';
import LoadingSpinner from '../../../components/asynccontent/LoadingSpinner';

class TopUtilizersResultsContainer extends React.Component {
  static propTypes = {
    results: PropTypes.array.isRequired,
    entitySet: PropTypes.object.isRequired,
    isGettingResults: PropTypes.bool.isRequired,
    entitySetId: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      entitySet: null,
      propertyTypes: []
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

  // getPropertyTypes = () => {
  //   return this.state.entitySet ? this.props.entitySet.entityType.properties : [];
  // }

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
    if (this.state.propertyTypes.length === 0) return null;
    return (
      <SearchResultsTable
          results={this.props.results.toJS()}
          propertyTypes={this.state.propertyTypes}
          formatValueFn={this.formatValue}
          entitySetId={this.props.entitySetId}
          showCount />
    );
  }

  renderContent = () => {
    return this.props.isGettingResults ? <LoadingSpinner /> : this.renderTable();
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
    entitySet: topUtilizers.get('entitySet'),
    entitySetId: topUtilizers.get('entitySetId')
  };
}

export default connect(mapStateToProps)(TopUtilizersResultsContainer);
