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
      selectedEntities: []
    }
  }

  selectAssociation = (data) => {
    this.props.selectAssociation(data);
    this.setState({ selectedAssociation: data });
  }

  selectArrow = (data) => {
    this.props.selectArrow(data);
    this.setState({ selectedArrow: data });
  }

  selectEntity = (data) => {
    this.props.selectEntity(data);
    const entities = this.state.selectedEntities.push(data);
    this.setState({ selectedEntities: entities });
  }

  render() {
    return(
      <TopUtilizersSelectionRow
          selectAssociation={this.selectAssociation}
          selectArrow={this.selectArrow}
          selectentity={this.selectEntity}
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
