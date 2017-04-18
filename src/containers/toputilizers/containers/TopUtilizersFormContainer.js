import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';

import * as actionFactory from '../TopUtilizersActionFactory';
import { entitySetDetailRequest } from '../../entitysetdetail/EntitySetDetailActionFactories';
import TopUtilizersForm from '../components/TopUtilizersForm';

class TopUtilizersFormContainer extends React.Component {
  static propTypes = {
    entitySetId: PropTypes.string.isRequired
  }

  render() {
    return (
      <TopUtilizersForm />
    );
  }
}

function mapStateToProps(state) {
  const topUtilizers = state.get('topUtilizers');

  return {
    entitySetId: topUtilizers.get('entitySetId')
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const actions = {

  };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TopUtilizersFormContainer);
