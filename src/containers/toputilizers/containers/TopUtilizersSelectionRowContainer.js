import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionFactory from '../TopUtilizersActionFactory';
import TopUtilizersSelectionRow from '../components/TopUtilizersSelectionRow';

class TopUtilizersSelectionRowContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedAssociation: null,
      selectedArrow: null,
      selectedEntities: null
    }
  }

  render() {
    return(
      <TopUtilizersSelectionRow
          selectAssociation={this.props.selectAssociation}
          selectArrow={this.props.selectArrow}
          selectentity={this.props.selectEntity}
          associations={this.props.associations}
          selectedAssociation={this.state.selectedAssociation}
          selectedArrow={this.state.selectedArrow}
          selectedEntities={this.state.selectedEntities} />
    );
  }
}

function mapStateToProps(state) {
  const topUtilizers = state.get('topUtilizers');

  return {
    associations: topUtilizers.get('associations')
  };
}

function mapDispatchToProps(dispatch) {
  const actions = {
    selectAssociation: actionFactory.onAssociationSelect,
    selectArrow: actionFactory.onArrowSelect,
    selectEntity: actionFactory.onEntitySelect
  };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TopUtilizersSelectionRowContainer);
