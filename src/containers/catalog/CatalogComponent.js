import React, { PropTypes } from 'react';
import { Pagination } from 'react-bootstrap';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import Page from '../../components/page/Page';
import { EntitySetPropType } from '../edm/EdmModel';
import { EntitySetNschema } from '../edm/EdmStorage';
import EntitySetList from '../../components/entityset/EntitySetList';
import SecurableObjectSearch, { FilterParamsPropType } from '../securableobject/SecurableObjectSearch';
import { catalogSearchRequest } from './CatalogActionFactories';
import AsyncContent, { AsyncStatePropType } from '../../components/asynccontent/AsyncContent';
import styles from '../entitysetsearch/styles.module.css';

const MAX_HITS = 10;

class CatalogComponent extends React.Component {
  static propTypes = {
    asyncState: AsyncStatePropType.isRequired,
    entitySets: PropTypes.arrayOf(EntitySetPropType).isRequired,
    onSubmitSearch: PropTypes.func.isRequired,
    filterParams: FilterParamsPropType,
    numHits: PropTypes.number
  };

  componentDidMount() {
    if (this.props.filterParams) {
      this.props.onSubmitSearch(this.props.filterParams);
    }
  }

  handlePageSelect = (page) => {
    if (this.props.filterParams) {
      const filterParams = Object.assign({}, this.props.filterParams, { page });
      this.props.onSubmitSearch(filterParams);
    }
  }

  renderPagination = () => {
    if (!this.props.filterParams || !this.props.filterParams.page || !this.props.numHits) return null;
    const activePage = parseInt(this.props.filterParams.page, 10);
    if (isNaN(activePage) || !this.props.numHits) return null;
    const numPages = Math.ceil((1.0 * this.props.numHits) / MAX_HITS);
    return (
      <div className={styles.paginationWrapper}>
        <Pagination
            prev
            next
            ellipsis
            boundaryLinks
            items={numPages}
            maxButtons={5}
            activePage={activePage}
            onSelect={this.handlePageSelect} />
      </div>
    );
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
          {this.renderPagination()}
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
    filterParams.searchTerm = query.kw;
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
  if (query.page) {
    filterParams.page = query.page;
    hasFilters = true;
  } else {
    filterParams.page = 1;
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

  if (filterParams.searchTerm) {
    query.kw = filterParams.searchTerm;
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
  if (filterParams.page) {
    query.page = filterParams.page;
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
    ),
    numHits: catalog.numHits
  };
}

// TODO: Decide if/how to incorporate bindActionCreators
function mapDispatchToProps(dispatch, ownProps) {
  return {
    onSubmitSearch: (filterParams) => {

      const start = (filterParams.page) ? (filterParams.page - 1) * MAX_HITS : 0;
      const maxHits = MAX_HITS;

      const newLocation = Object.assign({}, ownProps.location, locationFromFilterParams(filterParams));
      ownProps.router.push(newLocation);
      const searchParams = Object.assign({}, filterParams, { start, maxHits });
      dispatch(catalogSearchRequest(searchParams));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogComponent);
