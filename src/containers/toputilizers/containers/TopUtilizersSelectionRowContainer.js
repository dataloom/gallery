import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';

import * as actionFactory from '../TopUtilizersActionFactory';
import TopUtilizersSelectionRow from '../components/TopUtilizersSelectionRow';

class TopUtilizersSelectionRowContainer extends React.Component {
  static propTypes = {
    associations: PropTypes.instanceOf(Immutable.List).isRequired,
    selectEntity: PropTypes.func.isRequired,
    entityTypes: PropTypes.instanceOf(Immutable.List).isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedAssociation: null,
      selectedArrow: null,
      selectedEntities: []
    };
  }

  formatEntityOptions = (entities) => {
    return entities.map((entity) => {
      return { value: entity.get('id'), label: entity.get('title') };
    });
  }

  selectAssociation = (data) => {
    this.setState({ selectedAssociation: data });
  }

  selectArrow = (data) => {
    this.setState({ selectedArrow: data });
  }

  selectEntity = (selectedEntities) => {
    const { selectedAssociation, selectedArrow } = this.state;
    const data = {
      selectedAssociation,
      selectedArrow,
      selectedEntities
    };
    this.setState({ selectedEntities });
    this.props.selectEntity(data);
  }

  render() {
    return (
      <TopUtilizersSelectionRow
          selectAssociation={this.selectAssociation}
          selectArrow={this.selectArrow}
          selectEntity={this.selectEntity}
          associations={this.props.associations}
          entityTypes={this.props.entityTypes}
          selectedAssociation={this.state.selectedAssociation}
          selectedArrow={this.state.selectedArrow}
          selectedEntities={this.state.selectedEntities} />
    );
  }
}

function mapStateToProps(state) {
  const topUtilizers = state.get('topUtilizers');

  return {
    associations: topUtilizers.get('associations'),
    entityTypes: topUtilizers.get('entityTypes')
  };
}

function mapDispatchToProps(dispatch) {
  const actions = {
    selectEntity: actionFactory.onEntitySelect
  };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TopUtilizersSelectionRowContainer);
