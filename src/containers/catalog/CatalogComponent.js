import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import Page from '../../components/page/Page';
import { EntitySetPropType } from '../../components/entityset/EntitySetStorage';
import { EntitySetNschema } from '../edm/EdmStorage';
import EntitySetList from '../../components/entityset/EntitySetList';
import SecurableObjectSearch, { FilterParamsPropType } from '../../components/securableobject/SecurableObjectSearch';
import { catalogSearchRequest } from './CatalogActionFactories';
import AsyncContent, { AsyncStatePropType } from '../../components/asynccontent/AsyncContent';

// TODO: Replace with Async calls
const ENTITY_SET_TYPE_OPTIONS = [{
  value: 'c271a300-ea05-420b-b33b-8ecb18de5ce7',
  label: 'Employee'
}];

const PROPERTY_TYPE_OPTIONS = [{
  value: '033fef2a-8f34-4bcd-b1ad-e123c462561d',
  label: 'Employee ID'
}, {
  value: 'e76bc4e4-cf6a-43f4-a338-d241ded39093',
  label: 'Employee ID'
}, {
  value: '9727370f-8506-402c-8f35-2da4dbbb3c06',
  label: 'Employee Title'
}, {
  value: 'eb15c62d-fe91-4231-abb7-1228759cae43',
  label: 'Employee Salary'
}, {
  value: '0bae0920-2b89-4da0-8af9-8079a52d9e98',
  label: 'Employee Department'
}];

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
            entitySetTypeOptions={ENTITY_SET_TYPE_OPTIONS}
            propertyTypeOptions={PROPERTY_TYPE_OPTIONS}
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
    filterParams.entitySetTypeId = query.eid;
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
  if (filterParams.entitySetTypeId) {
    query.eid = filterParams.entitySetTypeId;
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
