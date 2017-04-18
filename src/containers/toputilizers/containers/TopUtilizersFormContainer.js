import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';

import * as actionFactory from '../TopUtilizersActionFactory';
import TopUtilizersForm from '../components/TopUtilizersForm';
import { allEntitySetsRequest } from '../../catalog/CatalogActionFactories';
import { getShallowEdmObjectSilent } from '../../edm/EdmStorage';


class TopUtilizersFormContainer extends React.Component {
  static propTypes = {
    entitySetId: PropTypes.string.isRequired
  }

  componentDidMount() {
    this.props.allEntitySetsRequest();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.entitySets) {
      console.log('nextprops entitysets:', nextProps.entitySets.toJS());

    }
  }

  render() {
    return (
      <TopUtilizersForm />
    );
  }
}

function mapStateToProps(state) {
  const topUtilizers = state.get('topUtilizers');
  const catalog = state.get('catalog');
  const normalizedData = state.get('normalizedData').toJS();

  let entitySets = [];
  if (catalog && catalog.get('allEntitySetReferences')) {
    entitySets = catalog.get('allEntitySetReferences').map((reference) => {
      return getShallowEdmObjectSilent(normalizedData, reference, null);
    }).filter((entitySet) => {
      return entitySet;
    });
  }

  return {
    entitySetId: topUtilizers.get('entitySetId'),
    entitySets
  };
}

function mapDispatchToProps(dispatch) {
  const actions = {
    allEntitySetsRequest
  };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TopUtilizersFormContainer);
