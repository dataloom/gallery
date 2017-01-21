import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import Page from '../../components/page/Page';
import { EntitySetPropType } from '../../components/entityset/EntitySetStorage';
import { EntitySetNschema } from '../edm/EdmStorage';
import EntitySetList from '../../components/entityset/EntitySetList';
import SecurableObjectSearch, { FilterParamsPropType } from '../securableobject/SecurableObjectSearch';
import { catalogSearchRequest } from './CatalogActionFactories';
import AsyncContent, { AsyncStatePropType } from '../../components/asynccontent/AsyncContent';

class CatalogComponent extends React.Component {
  static propTypes = {
    asyncState: AsyncStatePropType.isRequired,
    entitySets: PropTypes.arrayOf(EntitySetPropType).isRequired,
    onSubmitSearch: PropTypes.func.isRequired,
    filterParams: FilterParamsPropType
  };

  componentDidMount() {
    if (this.props.filterParams) {
      this.props.onSubmitSearch(this.props.filterParams);
    }
  }

  render() {
    return (
      <Page>
        <Page.Header>
          <Page.Title>Browse the catalog</Page.Title>
          <SecurableObjectSearch
            filterParams={this.props.filterParams}
            onSubmit={this.props.onSubmitSearch}
          />
        </Page.Header>
        <Page.Body>
          <AsyncContent {...this.props.asyncState}
            pendingContent={<h2>Please run a search</h2>}
            content={() => <EntitySetList {...this.props} />}
          />
        </Page.Body>
      </Page>
    );
  }
}

function filterParamsFromLocation(location) {
  const query = location.query;
  const filterParams = {};
  let hasFilters = false;

  if (query.kw) {
    filterParams.keyword = query.kw;
    hasFilters = true;
  }
  if (query.eid) {
    filterParams.entityTypeId = query.eid;
    hasFilters = true;
  }
  if (query.pid) {
    const pid = query.pid;
    hasFilters = true;
    if (Array.isArray(pid)) {
      filterParams.propertyTypeIds = pid;
    } else {
      filterParams.propertyTypeIds = [pid];
    }
  }

  if (hasFilters) {
    return filterParams;
  } else {
    return null;
  }
}

function locationFromFilterParams(filterParams) {
  const query = {};
  let hasFilters = false;

  if (filterParams.keyword) {
    query.kw = filterParams.keyword;
    hasFilters = true;
  }
  if (filterParams.entityTypeId) {
    query.eid = filterParams.entityTypeId;
    hasFilters = true;
  }
  if (filterParams.propertyTypeIds) {
    query.pid = filterParams.propertyTypeIds;
    hasFilters = true;
  }

  if (hasFilters) {
    return { query };
  } else {
    return {};
  }
}

function mapStateToProps(state, ownProps) {
  const catalog = state.get('catalog').toJS();
  const normalizedData = state.get('normalizedData').toJS();

  return {
    asyncState: catalog.asyncState,
    filterParams: filterParamsFromLocation(ownProps.location),
    entitySets: denormalize(
      catalog.entitySetIds,
      [EntitySetNschema],
      normalizedData
    )
  };
}

// TODO: Decide if/how to incorporate bindActionCreators
function mapDispatchToProps(dispatch, ownProps) {
  return {
    onSubmitSearch: (filterParams) => {
      const newLocation = Object.assign({}, ownProps.location, locationFromFilterParams(filterParams));
      ownProps.router.push(newLocation);
      dispatch(catalogSearchRequest(filterParams));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogComponent);
