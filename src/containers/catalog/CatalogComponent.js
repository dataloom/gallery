import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { EntitySetList } from '../../components/entityset/EntitySetList';

class CatalogComponent extends React.Component {
  static propTypes = {
    entitySets: PropTypes.array.isRequired
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
}

function mapStateToProps(state) {
  return state.get('catalog');
}

export default connect(mapStateToProps)(CatalogComponent);