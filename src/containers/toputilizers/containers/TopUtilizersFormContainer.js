import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';

import * as actionFactory from '../TopUtilizersActionFactory';
import TopUtilizersForm from '../components/TopUtilizersForm';
import { allEntitySetsRequest } from '../../catalog/CatalogActionFactories';
import { getShallowEdmObjectSilent } from '../../edm/EdmStorage';
import DummyData from '../DummyData';


class TopUtilizersFormContainer extends React.Component {
  static propTypes = {
    entitySetId: PropTypes.string.isRequired
  }
  constructor(props) {
    super(props);

    this.state = {
      isReadyForNext: true
    };
  }

  componentDidMount() {
    this.props.allEntitySetsRequest();
  }

    //QUESTION: How to get access to selected association and keep the whole row scoped to it?
    //IDEA: Each row has selectedAssociation and selectedArrow state, so that any child selector will refer to it.

  render() {
    return (
      <TopUtilizersForm isReadyForNext={this.state.isReadyForNext} />
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
    entitySets,
    associations: DummyData
  };
}

function mapDispatchToProps(dispatch) {
  const actions = {
    allEntitySetsRequest,
    submitQuery: actionFactory.onSubmit
  };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TopUtilizersFormContainer);
