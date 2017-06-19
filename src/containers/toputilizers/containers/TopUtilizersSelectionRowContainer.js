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
    selectAssociation: PropTypes.func.isRequired,
    entityTypeId: PropTypes.string.isRequired,
    associationDetails: PropTypes.instanceOf(Immutable.Map).isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedAssociation: null,
      selectedArrow: {},
      selectedEntities: [],
      arrowOptions: [],
      entityTypeOptions: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.selectedAssociation) return;
    const details = nextProps.associationDetails.get(this.state.selectedAssociation.value);
    if (details && !this.props.associationDetails.get(this.state.selectedAssociation.value)) {
      this.setNeighborAndArrowOptions(details);
    }
  }

  formatEntityOptions = (entities) => {
    return entities.map((entity) => {
      return { value: entity.get('id'), label: entity.get('title') };
    });
  }

  setNeighborAndArrowOptions = (details) => {
    let srcEntityTypes = details.src;
    let dstEntityTypes = details.dst;
    let entityTypeOptions = [];
    let arrowOptions = [];

    if (details.bidirectional) {
      const combined = srcEntityTypes.concat(dstEntityTypes);
      srcEntityTypes = combined;
      dstEntityTypes = combined;
      arrowOptions = [true, false];
      entityTypeOptions = combined;
    }
    else {
      if (srcEntityTypes.filter((entityType) => {
        return entityType.id === this.props.entityTypeId;
      }).length) {
        arrowOptions.push(true);
        entityTypeOptions = entityTypeOptions.concat(dstEntityTypes);
      }

      if (dstEntityTypes.filter((entityType) => {
        return entityType.id === this.props.entityTypeId;
      }).length) {
        arrowOptions.push(false);
        entityTypeOptions = entityTypeOptions.concat(srcEntityTypes);
      }
    }
    entityTypeOptions = [...new Set(entityTypeOptions)];
    this.setState({ arrowOptions, entityTypeOptions });
  }

  selectAssociation = (data) => {
    this.setState({
      selectedAssociation: data,
      selectedEntities: [],
      selectedArrow: {},
      arrowOptions: [],
      entityTypeOptions: []
    });
    const associationDetails = this.props.associationDetails.get(data.value);
    if (associationDetails) this.setNeighborAndArrowOptions(associationDetails);
    else this.props.selectAssociation(data.value);
  }

  selectArrow = (selectedArrow) => {
    if (!this.state.selectedAssociation || selectedArrow.value === this.state.selectedArrow.value) return;
    const details = this.props.associationDetails.get(this.state.selectedAssociation.value);
    if (!details) return;
    let entityTypeOptions = [];
    if (details.bidirectional) {
      entityTypeOptions = [...new Set(details.src.concat(details.dst))];
    }
    else if (selectedArrow.value) {
      entityTypeOptions = details.dst;
    }
    else entityTypeOptions = details.src;
    this.setState({
      selectedArrow,
      entityTypeOptions,
      selectedEntities: []
    });
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
          associations={this.props.associations.toJS()}
          entityTypes={this.state.entityTypeOptions}
          selectedAssociation={this.state.selectedAssociation}
          selectedArrow={this.state.selectedArrow}
          selectedEntities={this.state.selectedEntities}
          arrowDirections={this.state.arrowOptions} />
    );
  }
}

function mapStateToProps(state) {
  const topUtilizers = state.get('topUtilizers');

  return {
    associations: topUtilizers.get('associations'),
    associationDetails: topUtilizers.get('associationDetails'),
    entityTypeId: topUtilizers.get('entitySet').entityTypeId
  };
}

function mapDispatchToProps(dispatch) {
  const actions = {
    selectEntity: actionFactory.onEntitySelect,
    selectAssociation: actionFactory.getAssociationDetailsRequest
  };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TopUtilizersSelectionRowContainer);
