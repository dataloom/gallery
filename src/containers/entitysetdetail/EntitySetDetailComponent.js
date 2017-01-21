import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import * as actionFactories from './EntitySetDetailActionFactories';
import * as edmActionFactories from '../edm/EdmActionFactories';
import * as PermissionsActionFactory from '../permissions/PermissionsActionFactory';
import { PermissionsPropType, getPermissions, DEFAULT_PERMISSIONS } from '../permissions/PermissionsStorage';
import { getEdmObject } from '../edm/EdmStorage';
import PropertyTypeList from '../edm/components/PropertyTypeList';
import ActionDropdown from '../../components/entityset/ActionDropdown';
import AsyncContent, { AsyncStatePropType } from '../../components/asynccontent/AsyncContent';
import { EntitySetPropType } from '../edm/EdmModel';
import Page from '../../components/page/Page';
import styles from './entitysetdetail.module.css';


class EntitySetDetailComponent extends React.Component {
  static propTypes = {
    asyncState: AsyncStatePropType.isRequired,
    entitySet: EntitySetPropType,
    entitySetPermissions: PermissionsPropType.isRequired,
    loadEntitySet: PropTypes.func.isRequired
  };

  renderHeaderContent = () => {
    const { entitySet, entitySetPermissions } = this.props;

    return (
      <div className={styles.headerContent}>
        <div>
          <Page.Title>{entitySet.title}</Page.Title>
          <div className={styles.descriptionTitle}>About this data</div>
          {entitySet.description}
        </div>

        <div className={styles.controls}>
          { entitySetPermissions.OWNER ? <Button bsStyle="primary" className={styles.control}>Manage Permissions</Button> : ''}
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
          <h2 className={styles.propertyTypeTitle}>Data in Entity Set</h2>

          <AsyncContent {...this.props.asyncState} content={() => {
            return (<PropertyTypeList propertyTypes={this.props.entitySet.entityType.properties}/>);
          }}/>

        </Page.Body>
      </Page>
    );
  }

  componentDidMount() {
    this.props.loadEntitySet();
  }
}

function mapStateToProps(state) {
  const entitySetDetail = state.get('entitySetDetail'),
    normalizedData = state.get('normalizedData'),
    permissions = state.get('permissions');

  let entitySet;
  let entitySetPermissions;
  const reference = entitySetDetail.get('entitySetReference');
  if (reference) {
    entitySet = getEdmObject(normalizedData.toJS(), reference.toJS());
    entitySetPermissions = getPermissions(permissions, [entitySet.id])
  } else {
    entitySetPermissions = DEFAULT_PERMISSIONS;
  }

  return {
    asyncState: entitySetDetail.get('asyncState').toJS(),
    entitySet,
    entitySetPermissions
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  const id = ownProps.params.id;
  return {
    loadEntitySet: () => {
      dispatch(actionFactories.entitySetDetailRequest(id));
      dispatch(PermissionsActionFactory.getEntitySetsAuthorizations([id]));
      // TODO: Move filter creation in helper function in EdmApi
      dispatch(edmActionFactories.filteredEdmRequest(
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
