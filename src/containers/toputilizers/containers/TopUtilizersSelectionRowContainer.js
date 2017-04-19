import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionFactory from '../TopUtilizersActionFactory';
import TopUtilizersSelectionRow from '../components/TopUtilizersSelectionRow';

class TopUtilizersSelectionRowContainer extends React.Component {
  static propTypes = {
    associations: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedAssociation: null,
      selectedArrow: null,
      selectedEntities: []
      // entityOptions: []
    }
  }

  formatEntityOptions = (entities) => {
    return entities.map((entity) => {
      return { value: entity.get('id'), label: entity.get('title') };
    });
  }

// TODO: Get filter entity options based on selected association and arrow
  // getEntityOptions = () => {
  //   this.props.associations.forEach((assoc) => {
  //     if (this.state.selectedAssociation && assoc.get('title') === this.state.selectedAssociation.label) {
  //       if (this.state.selectedArrow === true) {
  //         const entityOptions = this.formatEntityOptions(assoc.get('sourceVals')).toJS();
  //         this.setState({ entityOptions });
  //       }
  //       else if (this.state.selectedArrow === false) {
  //         const entityOptions = this.formatEntityOptions(assoc.get('destVals')).toJS();
  //         this.setState({ entityOptions });
  //       }
  //       // TODO: Handle bi-directional arrows
  //     }
  //   });
  // }

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
    return(
      <TopUtilizersSelectionRow
          selectAssociation={this.selectAssociation}
          selectArrow={this.selectArrow}
          selectEntity={this.selectEntity}
          associations={this.props.associations}
          selectedAssociation={this.state.selectedAssociation}
          selectedArrow={this.state.selectedArrow}
          // entityOptions={this.state.entityOptions}
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
    selectEntity: actionFactory.onEntitySelect
  };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TopUtilizersSelectionRowContainer);
