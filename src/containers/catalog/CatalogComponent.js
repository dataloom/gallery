import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { EntitySetPropType } from '../../components/entityset/EntitySet';
import { FilteredEntitySetList, FilterParamsPropType } from '../../components/entityset/EntitySetList';
import { createEntitySetListRequest, createUpdateFilters } from './CatalogActionFactories';
import AsyncContent from '../../components/asynccontent/AsyncContent';

class CatalogComponent extends React.Component {
  static propTypes = {
    asyncState: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      errorMessage: PropTypes.string
    }).isRequired,
    filterParams: FilterParamsPropType.isRequired,
    onFilterUpdate: PropTypes.func,
    entitySets: PropTypes.arrayOf(EntitySetPropType).isRequired,
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
  return state.get('catalog').toJS();
}

//TODO: Decide if/how to incorporate bindActionCreators
function mapDispatchToProps(dispatch) {
  return {
    requestEntitySets: () => { dispatch(createEntitySetListRequest()) },
    onFilterUpdate: (filterParams) => { dispatch(createUpdateFilters(filterParams))}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogComponent);