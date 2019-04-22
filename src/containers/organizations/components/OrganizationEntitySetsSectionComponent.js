import React from 'react';
import { Link } from 'react-router';
import { List, Map, Set } from 'immutable';

import styled, {
  css
} from 'styled-components';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import StyledBadge from '../../../components/badges/StyledBadge';
import StyledFlexContainer from '../../../components/flex/StyledFlexContainer';
import StyledFlexContainerStacked from '../../../components/flex/StyledFlexContainerStacked';
import ButtonToolbar from '../../../components/controls/ButtonToolbar';
import BasicButton from '../../../components/buttons/BasicButton';
import StyledCheckbox from '../../../components/controls/StyledCheckbox';

import StyledSectionHeading from './StyledSectionHeading';

import {
  RemoveButton,
  StyledElement,
  StyledListItem
} from './StyledListGroupComponents';

import { assembleEntitySets, synchronizeDataChanges, synchronizeEdmChanges } from '../actions/OrganizationActionFactory';

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const StyledSubSectionHeading = styled(StyledSectionHeading)`
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
`;

const EntitySetsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const EntitySetCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 450px;
  height: fit-content;
  margin: 10px;
  padding: 25px;
  border-radius: 5px;
  background-color: #ffffff;
  border: solid 1px #dcdce7;

  a {
    font-family: 'Open Sans', sans-serif;
    font-size: 18px;
    font-weight: 600;
    color: #2e2e34;
    margin: 0;
    padding: 5px 0;
    overflow: ${props => (props.expanded ? 'visible' : 'hidden')};
    text-overflow: ellipsis;
    white-space: ${props => (props.expanded ? 'normal' : 'nowrap')};
  }

  span {
    margin: 10px 0;
    min-height: 13px;
    font-family: 'Open Sans', sans-serif;
    font-size: 12px;
    color: #8e929b;
    overflow: ${props => (props.expanded ? 'visible' : 'hidden')};
    text-overflow: ellipsis;
    white-space: ${props => (props.expanded ? 'normal' : 'nowrap')};
    display: block;
  }
`;

const ButtonRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const MaterializeButton = styled(BasicButton)`
  width: fit-content;
  height: 29px;
  font-size: 11px;
  padding: 0 10px;
  margin: 0 10px;
  align-self: center;
`;

const NoEntitySetsMessage = styled.div`
  padding-bottom: 30px;
  font-size: 14px;
`;

const INTERNAL = 'INTERNAL';
const EXTERNAL = 'EXTERNAL';
const MATERIALIZED = 'MATERIALIZED';
const EDM_UNSYNCHRONIZED = 'EDM_UNSYNCHRONIZED';
const DATA_UNSYNCHRONIZED = 'DATA_UNSYNCHRONIZED';

function mapStateToProps(state, ownProps) {

  return {
    entitySetsById: state.getIn(['organizations', 'entitySetsById']),
    entityTypesById: state.getIn(['organizations', 'entityTypesById']),
    organizationEntitySets: state.getIn(['organizations', 'organizationEntitySets']),
    materializableEntitySetIds: state.getIn(['organizations', 'materializableEntitySetIds']),
    entitySetIdsUpdating: state.getIn(['organizations', 'entitySetIdsUpdating'])
  };
}

function mapDispatchToProps(dispatch) {

  const actions = {
    assembleEntitySets,
    synchronizeDataChanges,
    synchronizeEdmChanges
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class OrganizationEntitySetsSectionComponent extends React.Component {

  static propTypes = {
    actions: React.PropTypes.shape({
      assembleEntitySets: React.PropTypes.func.isRequired,
      synchronizeDataChanges: React.PropTypes.func.isRequired,
      synchronizeEdmChanges: React.PropTypes.func.isRequired
    }).isRequired,
    organization: React.PropTypes.instanceOf(Map).isRequired,
    entitySetsById: React.PropTypes.instanceOf(Map).isRequired,
    organizationEntitySets: React.PropTypes.instanceOf(Map).isRequired,
    entityTypesById: React.PropTypes.instanceOf(Map).isRequired,
    materializableEntitySetIds: React.PropTypes.instanceOf(Set).isRequired,
    entitySetIdsUpdating: React.PropTypes.instanceOf(Set).isRequired
  }

  constructor(props) {

    super(props);

    this.state = {
      internalView: true,
      materializedView: false
    };
  }

  renderToolbars = () => {
    const { internalView, materializedView } = this.state;

    const internalExternalOptions = [
      {
        label: 'Internal',
        value: true,
        onClick: () => this.setState({ internalView: true })
      },
      {
        label: 'External',
        value: false,
        onClick: () => this.setState({ internalView: false })
      }
    ];

    const materializedOptions = [
      {
        label: 'Not materialized',
        value: false,
        onClick: () => this.setState({ materializedView: false })
      },
      {
        label: 'Materialized',
        value: true,
        onClick: () => this.setState({ materializedView: true })
      }
    ];

    return (
      <RowContainer>
        <ButtonToolbar options={internalExternalOptions} value={internalView} />
        <ButtonToolbar options={materializedOptions} value={materializedView} />
      </RowContainer>
    );

  }

  getFilteredEntitySets = () => {
    const { entitySetsById, organizationEntitySets } = this.props;
    const { internalView, materializedView } = this.state;

    return organizationEntitySets.entrySeq().filter(([entitySetId, flags]) => {
      const internalFilterMatch = (internalView && flags.includes(INTERNAL)) || (!internalView && flags.includes(EXTERNAL));
      const materializedFilterMatch = materializedView === flags.includes(MATERIALIZED);

      return internalFilterMatch && materializedFilterMatch;
    }).map(([entitySetId]) => entitySetsById.get(entitySetId, Map()));

  }

  materialize = (entitySetId) => {
    const { actions, organization } = this.props;

    const organizationId = organization.get('id');
    const entitySetIds = [entitySetId];
    actions.assembleEntitySets({ organizationId, entitySetIds });
  }

  syncEDM = (entitySetId) => {
    const { actions, organization } = this.props;

    const organizationId = organization.get('id');
    actions.synchronizeEdmChanges({ organizationId, entitySetId });
  }

  syncData = (entitySetId) => {
    const { actions, organization } = this.props;

    const organizationId = organization.get('id');
    actions.synchronizeDataChanges({ organizationId, entitySetId });
  }

  hasTag = (entitySetId, tag) => {
    const { organizationEntitySets } = this.props;
    return organizationEntitySets.get(entitySetId, List()).contains(tag);
  }


  renderEntitySet = (entitySet) => {
    const {
      history,
      entitySetIdsUpdating,
      organizationEntitySets,
      materializableEntitySetIds
    } = this.props;

    const entitySetId = entitySet.get('id');

    const isMaterialized = this.hasTag(entitySetId, MATERIALIZED);
    const isUpdating = entitySetIdsUpdating.has(entitySetId);

    const canMaterialize = !isMaterialized && materializableEntitySetIds.has(entitySetId);
    const edmOutOfSync = isMaterialized && this.hasTag(entitySetId, EDM_UNSYNCHRONIZED);
    const dataOutOfSync = isMaterialized && this.hasTag(entitySetId, DATA_UNSYNCHRONIZED);

    return (
      <EntitySetCard key={entitySetId}>
        <Link to={`/entitysets/${entitySetId}`}>{entitySet.get('title')}</Link>
        <span>{entitySet.get('name')}</span>
        <ButtonRow>
          {canMaterialize
            ? <MaterializeButton onClick={() => this.materialize(entitySetId)}>Materialize Entity Set</MaterializeButton>
            : null}
          {edmOutOfSync
            ? <MaterializeButton onClick={() => this.syncEDM(entitySetId)} disabled={isUpdating}>Synchronize EDM</MaterializeButton>
            : null}
          {dataOutOfSync
            ? <MaterializeButton onClick={() => this.syncData(entitySetId)} disabled={isUpdating}>Synchronize Data</MaterializeButton>
            : null}
        </ButtonRow>
      </EntitySetCard>
    );

  }

  isAssociationEntitySet = (entitySet) => {
    const { entityTypesById } = this.props;

    return entityTypesById.getIn([entitySet.get('entityTypeId'), 'category']) === 'AssociationType';
  }

  getNoEntitySetsMessage = (isAssociation) => {
    const { internalView, materializedView } = this.state;

    const entitySetTypeStr = isAssociation ? 'association' : 'regular';
    const internalTypeStr = internalView ? 'internal' : 'external';
    const materializedTypeStr = materializedView ? 'materialized' : 'not materialized';

    const msg = `No ${entitySetTypeStr} entity sets that are ${internalTypeStr} and ${materializedTypeStr}`;

    return <NoEntitySetsMessage>{msg}</NoEntitySetsMessage>;
  }

  renderFilteredEntitySets = () => {
    const entitySets = this.getFilteredEntitySets();

    const regularEntitySets = entitySets.filter(es => !this.isAssociationEntitySet(es));
    const associationEntitySets = entitySets.filter(this.isAssociationEntitySet);

    const regularEntitySetContent = regularEntitySets.count() ? (
      <EntitySetsWrapper>{regularEntitySets.map(this.renderEntitySet)}</EntitySetsWrapper>
    ) : this.getNoEntitySetsMessage(false);

    const associationEntitySetContent = associationEntitySets.count() ? (
      <EntitySetsWrapper>{associationEntitySets.map(this.renderEntitySet)}</EntitySetsWrapper>
    ) : this.getNoEntitySetsMessage(true);

    return (
      <StyledFlexContainerStacked>
        <StyledFlexContainerStacked>
          <StyledSubSectionHeading>Regular Entity Sets</StyledSubSectionHeading>
          {regularEntitySetContent}
        </StyledFlexContainerStacked>
        <StyledFlexContainerStacked>
          <StyledSubSectionHeading>Association Entity Sets</StyledSubSectionHeading>
          {associationEntitySetContent}
        </StyledFlexContainerStacked>

      </StyledFlexContainerStacked>
    )


  }

  render() {

    return (
      <StyledFlexContainerStacked>
        <StyledSectionHeading>
          <h3>Entity Sets</h3>
          <h5>These entity sets belong to this organization, and can be materialized by anyone with materialize permissions.</h5>
        </StyledSectionHeading>
        <StyledFlexContainerStacked>
          { this.renderToolbars() }
          { this.renderFilteredEntitySets() }
        </StyledFlexContainerStacked>
      </StyledFlexContainerStacked>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationEntitySetsSectionComponent);
