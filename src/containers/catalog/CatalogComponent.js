import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import { EntitySetPropType, EntitySetNschema } from '../../components/entityset/EntitySetStorage';
import { EntitySetList } from '../../components/entityset/EntitySetList';
import SecurableObjectSearch, { FilterParamsPropType } from '../../components/securableobject/SecurableObjectSearch';
import { catalogSearchRequest, createUpdateFilters } from './CatalogActionFactories';
import AsyncContent, { AsyncStatePropType } from '../../components/asynccontent/AsyncContent';
import styles from './catalog.module.css';

// TODO: Replace with Async calls
const ENTITY_SET_TYPE_OPTIONS = [{
  value: 'c271a300-ea05-420b-b33b-8ecb18de5ce7',
  label: 'Employee'
}];

const PROPERTY_TYPE_OPTIONS = [{
  value: '033fef2a-8f34-4bcd-b1ad-e123c462561d',
  label: 'Employee ID'
},{
  value: 'e76bc4e4-cf6a-43f4-a338-d241ded39093',
  label: 'Employee ID'
},{
  value: '9727370f-8506-402c-8f35-2da4dbbb3c06',
  label: 'Employee Title'
},{
  value: 'eb15c62d-fe91-4231-abb7-1228759cae43',
  label: 'Employee Salary'
},{
  value: '0bae0920-2b89-4da0-8af9-8079a52d9e98',
  label: 'Employee Department'
}];

class CatalogComponent extends React.Component {
  static propTypes = {
    asyncState: AsyncStatePropType.isRequired,
    filterParams: FilterParamsPropType.isRequired,
    entitySets: PropTypes.arrayOf(EntitySetPropType).isRequired,
    onFilterUpdate: PropTypes.func,
    onSubmitSearch: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className={styles.catalog}>
        <header>
          <h1>Browse the Catalog</h1>
          <SecurableObjectSearch
            entitySetTypeOptions={ENTITY_SET_TYPE_OPTIONS}
            propertyTypeOptions={PROPERTY_TYPE_OPTIONS}
            onSubmit={this.props.onSubmitSearch}
          />
        </header>
        <AsyncContent {...this.props.asyncState}
          pendingContent={<h2>Please run a search</h2>}
          content={() => <EntitySetList {...this.props} />}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const catalog = state.get('catalog').toJS();
  const normalizedData = state.get('normalizedData').toJS();

  return {
    asyncState: catalog.asyncState,
    filterParams: catalog.filterParams,
    entitySets: denormalize(
      catalog.entitySetIds,
      [EntitySetNschema],
      normalizedData
    )
  };
}

// TODO: Decide if/how to incorporate bindActionCreators
function mapDispatchToProps(dispatch) {
  return {
    onSubmitSearch: (filterParams) => { dispatch(catalogSearchRequest(filterParams)) },
    onFilterUpdate: (filterParams) => { dispatch(createUpdateFilters(filterParams)); }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogComponent);
