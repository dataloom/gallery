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
      entityOptions: [],
      selectedEntities: []
    }
  }

  formatEntityOptions = (entities) => {
    return entities.map((entity) => {
      return { value: entity.get('id'), label: entity.get('title') };
    });
  }

  getEntityOptions = () => {
    this.props.associations.forEach((assoc) => {
      if (assoc.get('title') === this.state.selectedAssociation.label) {
        if (this.state.selectedArrow.label === 'source') {
          const entityOptions = this.formatEntityOptions(assoc.get('sourceVals')).toJS();
          console.log('entityoptions:', entityOptions);
          this.setState({ entityOptions });
        }
        else if (this.state.selectedArrow.label === 'dest') {
          const entityOptions = this.formatEntityOptions(assoc.get('destVals')).toJS();
          this.setState({ entityOptions });
        }
        // TODO: Handle bi-directional arrows
      }
    });
  }

  selectAssociation = (data) => {
    this.props.selectAssociation(data);
    this.setState({ selectedAssociation: data });
  }

  selectArrow = (data) => {
    this.props.selectArrow(data);
    this.setState({ selectedArrow: data }, () => {
      this.getEntityOptions();
    });
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
          selectedEntities={this.state.selectedEntities}
          entityOptions={this.state.entityOptions} />
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
