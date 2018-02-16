import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';

import * as actionFactory from '../TopUtilizersActionFactory';
import TopUtilizersSelectionRow from '../components/TopUtilizersSelectionRow';

class TopUtilizersSelectionRowContainer extends React.Component {
  static propTypes = {
    neighborTypes: PropTypes.instanceOf(Immutable.List).isRequired,
    entitySetTitle: PropTypes.string.isRequired,
    updateEdgeTypes: PropTypes.func.isRequired,
    selectedEdges: PropTypes.instanceOf(Immutable.List).isRequired
  }

  updateEdgeTypes = (options) => {
    const selectedEdges = options.map((option) => {
      return {
        associationTypeId: option.assocId,
        neighborTypeIds: [option.neighborId],
        utilizerIsSrc: option.src
      };
    });
    this.props.updateEdgeTypes(Immutable.fromJS(selectedEdges));
  }

  render() {
    return (
      <TopUtilizersSelectionRow
          entitySetTitle={this.props.entitySetTitle}
          neighborTypes={this.props.neighborTypes}
          updateEdgeTypes={this.updateEdgeTypes}
          selectedEdges={this.props.selectedEdges} />
    );
  }
}

function mapStateToProps(state) {
  const topUtilizers = state.get('topUtilizers');

  return {
    neighborTypes: topUtilizers.get('neighborTypes', Immutable.List()),
    selectedEdges: topUtilizers.get('topUtilizersDetailsList', Immutable.List())
  };
}

function mapDispatchToProps(dispatch) {
  const actions = {
    updateEdgeTypes: actionFactory.updateEdgeTypes
  };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TopUtilizersSelectionRowContainer);
