import {
  Types
} from 'loom-data';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import groupBy from 'lodash/groupBy';
import classNames from 'classnames';

import { createStatusAsyncReference } from '../PermissionsStorage';
import * as PermissionsAccessFactory from '../PermissionsActionFactory';

import EntitySetPermissionsRequest from './EntitySetPermissionsRequest';
import { AsyncReferencePropType } from '../../async/AsyncStorage';
import AsyncContentListComponent from '../../async/components/AsyncContentListComponent';
import styles from './permissions.module.css';

const { RequestStateTypes } = Types;

class EntitySetPermissionsRequestList extends React.Component {
  static propTypes = {
    entitySetId: PropTypes.string.isRequired,
    propertyTypeIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    className: PropTypes.string,

    // Loaders
    loadStatuses: PropTypes.func.isRequired,

    // Async
    statusReferences: PropTypes.arrayOf(AsyncReferencePropType).isRequired
  };

  componentDidMount() {

    const aclKeys = this.props.propertyTypeIds.map((id) => {
      return [this.props.entitySetId, id];
    });

    this.props.loadStatuses(aclKeys);
  }

  renderContent = (statuses) => {

    const openStatuses = statuses.filter((status) => {
      if (status.status != null) {
        return status.status === RequestStateTypes.SUBMITTED;
      }
      else if (status.value != null) {
        return status.value.status === RequestStateTypes.SUBMITTED;
      }
      return false;
    });

    if (openStatuses.length === 0) {
      return null;
    }

    const statusesByPrincipalId = groupBy(openStatuses, (status) => {

      if (status.principal != null) {
        return status.principal.id;
      }

      return status.value.principal.id;
    });

    const entitySetPermissionsRequests = Object.keys(statusesByPrincipalId)
      .map((principalId) => {
        return (
          <EntitySetPermissionsRequest
              entitySetId={this.props.entitySetId}
              principalId={principalId}
              statuses={statusesByPrincipalId[principalId]}
              key={principalId} />
        );
      });

    return (
      <div>
        <h2 className={styles.permissionRequestListTitle}>Permission Requests</h2>
        {entitySetPermissionsRequests}
      </div>
    );
  }

  render() {
    const { statusReferences, className } = this.props;

    return (
      <div className={classNames(styles.permissionRequestList, className)}>
        <AsyncContentListComponent references={statusReferences} render={this.renderContent} />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const { entitySetId, propertyTypeIds } = ownProps;
  const statusReferences = propertyTypeIds
    .map(id => [entitySetId, id])
    .map(createStatusAsyncReference);

  return {
    statusReferences
  };
}

// TODO: Decide if/how to incorporate bindActionCreators
function mapDispatchToProps(dispatch) {
  return {
    loadStatuses: (aclKeys) => {
      dispatch(PermissionsAccessFactory.loadOpenStatusesRequest(aclKeys));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntitySetPermissionsRequestList);
