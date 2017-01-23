import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import groupBy from 'lodash/groupBy';

import { createStatusAsyncReference } from '../PermissionsStorage';
import * as PermissionsAccessFactory from '../PermissionsActionFactory';

import { AsyncReferencePropType } from '../../async/AsyncStorage';
import AsyncContentListComponent from '../../async/components/AsyncContentListComponent';
import styles from './requestPermissionsModal.module.css';

class EntitySetPermissionsRequest extends React.Component {
  static propTypes = {
    entitySetId: PropTypes.string.isRequired,
    propertyTypeIds: PropTypes.arrayOf(PropTypes.string).isRequired,

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

  renderContent(statuses) {
    const statusesByPrincipalId = groupBy(statuses, (status) => status.principal.id);

  }

  render() {
    const { statusReferences } = this.props;

    return (
      <AsyncContentListComponent references={statusReferences} render={this.renderContent}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(EntitySetPermissionsRequest);