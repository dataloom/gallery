import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { EntitySetList } from '../../components/entityset/EntitySetList';
import { createEntitySetListRequest } from './CatalogActionFactories';

class CatalogComponent extends React.Component {
  static propTypes = {
    entitySets: PropTypes.array.isRequired,
    requestEntitySets: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Catalog</h1>
        <EntitySetList entitySets={this.props.entitySets}/>
      </div>
    );
  }

  componentDidMount() {
    this.props.requestEntitySets();
  }
}

function mapStateToProps(state) {
  return state.get('catalog');
}

function mapDispatchToProps(dispatch) {
  return {
    requestEntitySets: () => { dispatch(createEntitySetListRequest()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CatalogComponent);