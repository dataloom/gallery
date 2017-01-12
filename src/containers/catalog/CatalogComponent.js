import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';

import { EntitySetPropType, EntitySetNschema } from '../../components/entityset/EntitySetStorage';
import { FilteredEntitySetList, FilterParamsPropType } from '../../components/entityset/EntitySetList';
import { catalogSearchRequest, createUpdateFilters } from './CatalogActionFactories';
import AsyncContent from '../../components/asynccontent/AsyncContent';

class CatalogComponent extends React.Component {
  static propTypes = {
    asyncState: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      errorMessage: PropTypes.string
    }).isRequired,
    filterParams: FilterParamsPropType.isRequired,
    entitySets: PropTypes.arrayOf(EntitySetPropType).isRequired,
    onFilterUpdate: PropTypes.func,
    requestEntitySets: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AsyncContent {...this.props.asyncState}>
        <FilteredEntitySetList {...this.props} />
      </AsyncContent>
    );
  }

  componentDidMount() {
    this.props.requestEntitySets();
  }
}

function mapStateToProps(state) {
  const catalog = state.get('catalog').toJS(),
    normalizedData = state.get('normalizedData').toJS();

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

//TODO: Decide if/how to incorporate bindActionCreators
function mapDispatchToProps(dispatch) {
  return {
    requestEntitySets: () => { dispatch(catalogSearchRequest()) },
    onFilterUpdate: (filterParams) => { dispatch(createUpdateFilters(filterParams))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogComponent);