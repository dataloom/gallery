import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';
import { Button } from 'react-bootstrap';

import Page from '../../components/page/Page';
import { EntitySetPropType } from '../../components/entityset/EntitySetStorage';
import { EntitySetNschema } from '../ndata/EdmNormalizeSchema';
import AsyncContent, { AsyncStatePropType } from '../../components/asynccontent/AsyncContent';
import PropertyTypeList from '../../components/propertytype/PropertyTypeList';
import * as actionFactories from './EntitySetDetailActionFactories';
import * as ndataActionFactories from '../ndata/NdataActionFactories';
import ActionDropdown from '../../components/entityset/ActionDropdown';
import styles from './entitysetdetail.module.css';

const EXAMPLE_PROPERTY_TYPES = [
  {
    id: '1',
    title: 'Title 1',
    description: 'description 1',
  },
  {
    id: '2',
    title: 'Title 2',
    description: 'description 2',
  },
];

class EntitySetDetailComponent extends React.Component {
  static propTypes = {
    asyncState: AsyncStatePropType.isRequired,
    entitySet: EntitySetPropType,
    loadEntitySet: PropTypes.func.isRequired
  };

  renderHeaderContent = () => {
    const { entitySet } = this.props;
    return (
      <div className={styles.headerContent}>
        <div>
          <Page.Title>{entitySet.title}</Page.Title>
          <div className={styles.descriptionTitle}>About this data</div>
          {entitySet.description}
        </div>

        <div className={styles.controls}>
          <Button bsStyle="primary" className={styles.control}>Manage Permissions</Button>
          <ActionDropdown entitySet={entitySet}/>
        </div>
      </div>
    );
  };

  render() {
    return (
      <Page>
        <Page.Header>
          <AsyncContent {...this.props.asyncState} content={this.renderHeaderContent}/>
        </Page.Header>
        <Page.Body>
          <PropertyTypeList propertyTypes={EXAMPLE_PROPERTY_TYPES}/>
        </Page.Body>
      </Page>
    );
  }

  componentDidMount() {
    this.props.loadEntitySet();
  }
}

function mapStateToProps(state, ownProps) {
  const entitySetDetail = state.get('entitySetDetail').toJS(),
    normalizedData = state.get('normalizedData');

  const entitySetId = ownProps.params.id;
  let entitySet;
  if (normalizedData.hasIn(['entitySets'], entitySetId)) {
    entitySet = denormalize(entitySetId, EntitySetNschema, normalizedData.toJS());
  } else {
    entitySet = null;
  }

  return {
    asyncState: entitySetDetail.asyncState,
    entitySet
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    loadEntitySet: () => {
      const id = ownProps.params.id;
      dispatch(actionFactories.entitySetDetailRequest(ownProps.params.id));
      dispatch(ndataActionFactories.filteredEdmRequest(
        [{
          type: 'EntitySet',
          id,
          'include': ['EntitySet', 'EntityType', 'PropertyTypeInEntitySet']
        }]
      ));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EntitySetDetailComponent);
