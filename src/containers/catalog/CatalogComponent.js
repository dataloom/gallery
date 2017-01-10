import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { EntitySetList } from '../../components/entityset/EntitySetList';
import { EntitySetPropType } from '../../components/entityset/EntitySet';
import { createEntitySetListRequest } from './CatalogActionFactories';
import AsyncContent from '../../components/asynccontent/AsyncContent';

class CatalogComponent extends React.Component {
  static propTypes = {
    asyncState: PropTypes.shape({
      isLoading: PropTypes.bool.isRequired,
      errorMessage: PropTypes.string
    }).isRequired,
    entitySets: PropTypes.arrayOf(EntitySetPropType).isRequired,
    requestEntitySets: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Catalog</h1>
        <AsyncContent {...this.props.asyncState}>
          <EntitySetList entitySets={this.props.entitySets}/>
        </AsyncContent>
      </div>
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
    requestEntitySets: () => { dispatch(createEntitySetListRequest()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogComponent);