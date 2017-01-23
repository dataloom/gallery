import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import groupBy from 'lodash/groupBy';
import classNames from 'classnames';

import { createStatusAsyncReference } from '../PermissionsStorage';
import * as PermissionsAccessFactory from '../PermissionsActionFactory';

import EntitySetPermissionsRequest from './EntitySetPermissionsRequest';
import { AsyncReferencePropType, STATUS as ASYNC_STATUS } from '../../async/AsyncStorage';
import AsyncContentListComponent from '../../async/components/AsyncContentListComponent';
import styles from './permissions.module.css';

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
    const { entitySetId, propertyTypeIds, loadStatuses } = this.props;
    const aclKeys = propertyTypeIds.map(id => [entitySetId, id]);
    loadStatuses(aclKeys);
  }

  renderContent = (statuses) => {
    const fulfilledStatuses = statuses.filter(status => status !== ASYNC_STATUS.NOT_FOUND);
    if (fulfilledStatuses.length == 0) {
      return null;
    }
    const statusesByPrincipalId = groupBy(fulfilledStatuses, (status) => status.principal.id);

    const { entitySetId } = this.props;
    const entitySetPermissionsRequests = Object.keys(statusesByPrincipalId)
        .map(principalId => {
          return (
            <EntitySetPermissionsRequest
              entitySetId={entitySetId}
              principalId={principalId}
              statuses={statusesByPrincipalId[principalId]}
              key={principalId}
            />
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
        <AsyncContentListComponent references={statusReferences} render={this.renderContent}/>
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