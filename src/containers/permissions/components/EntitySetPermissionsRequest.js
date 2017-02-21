import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import groupBy from 'lodash/groupBy';
import FontAwesome from 'react-fontawesome';
import classnames from 'classnames';

import { EntitySetPropType } from '../../edm/EdmModel';
import { StatusPropType, RequestStatus } from '../PermissionsStorage'
import { createPrincipalReference } from '../../principals/PrincipalsStorage';
import { getDisplayName } from '../../principals/PrincipalUtils';
import PrincipalActionsFactory from '../../principals/PrincipalsActionFactory';
import { createEntitySetReference, getEdmObjectSilent } from '../../edm/EdmStorage';
import * as PermissionsActionFactory from '../PermissionsActionFactory';

import { AsyncReferencePropType } from '../../async/AsyncStorage';
import AsyncContentComponent from '../../async/components/AsyncContentComponent';
import styles from './permissions.module.css';

class EntitySetPermissionsRequest extends React.Component {
  static propTypes = {
    principalId: PropTypes.string.isRequired,
    entitySetId: PropTypes.string.isRequired,
    statuses: PropTypes.arrayOf(StatusPropType).isRequired,

    // Saving
    updateStatuses: PropTypes.func.isRequired,
    // Loaders
    loadPrincipal: PropTypes.func.isRequired,

    // Async
    principalReference: AsyncReferencePropType.isRequired,
    // TODO: Move to AsyncReference
    entitySet: EntitySetPropType

  };

  constructor(props) {
    super(props);
    const selectedProperties = new Set();
    props.statuses.forEach((status) => {
      selectedProperties.add(status.aclKey[1]);
    });
    this.state = {
      open: false,
      selectedProperties
    };
  }

  componentDidMount() {
    this.props.loadPrincipal(this.props.principalId);
  }

  sendUpdateRequests = (requestStatus) => {
    const { updateStatuses, statuses } = this.props;
    const { selectedProperties } = this.state;
    if (statuses.length > 0) {
      const updatedStatuses = [];
      const defaultStatus = statuses[0];
      selectedProperties.forEach((propertyTypeId) => {
        const updatedStatus :Object[] = Immutable
          .fromJS(defaultStatus)
          .set('status', requestStatus)
          .setIn(['aclKey', 1], propertyTypeId)
          .toJS();
        updatedStatuses.push(updatedStatus);
      });
      updateStatuses(updatedStatuses);
    }
  }

  approve = () => {
    this.sendUpdateRequests(RequestStatus.APPROVED);
  };

  deny = () => {
    this.sendUpdateRequests(RequestStatus.DECLINED);
  };

  toggleCheckbox = (checked, propertyTypeId) => {
    const selectedProperties = new Set(this.state.selectedProperties);
    if (checked) {
      selectedProperties.add(propertyTypeId);
    }
    else {
      selectedProperties.delete(propertyTypeId);
    }
    this.setState({ selectedProperties });
  }

  renderProperty(principalId, propertyType, defaultChecked) {
    return (
      <div className="propertyType" key={propertyType.id}>
        <div className="propertyTypePermissions">
          <input
              type="checkbox"
              id={`ptr-${principalId}-${propertyType.id}`}
              defaultChecked={defaultChecked}
              onClick={(e) => {
                this.toggleCheckbox(e.target.checked, propertyType.id);
              }}
          />
        </div>
        <div className="propertyTypeTitle">
          <label htmlFor={`ptr-${principalId}-${propertyType.id}`}>{propertyType.title}</label>
        </div>
      </div>
    )
  }

  toggleBody = () => {
    this.setState({ open: !this.state.open });
  };

  renderContent = (principal) => {
    const { statuses, entitySet } = this.props;
    const propertyTypes = entitySet.entityType.properties;

    const statusByPropertyTypeId = groupBy(statuses, (status) => status.aclKey[1]);
    const content = propertyTypes.map(propertyType => {
      return this.renderProperty(principal.id, propertyType, statusByPropertyTypeId[propertyType.id]);
    });

    return (
      <div className={styles.permissionsRequest}>
        <div className={styles.permissionRequestHeader}>
          <div className={styles.permissionRequestTitle}>
            <span className={styles.principalName}>{ getDisplayName(principal) } </span>
            requested permission on
            <a onClick={this.toggleBody}> { statuses.length } properties</a>
          </div>
          <button className={styles.approveButton} onClick={this.approve}>
            <FontAwesome name="thumbs-o-up"/>
            Allow
          </button>
          <button className={styles.rejectButton} onClick={this.deny}>
            <FontAwesome name="thumbs-o-down"/>
            Deny
          </button>
        </div>

        <div className={styles.permissionRequestBody}>
          <div className={styles.subtitle}>Properties requested:</div>
          <div className="propertyTypeList">{ content }</div>
        </div>
      </div>
    );
  };

  render() {
    const { principalReference } = this.props;

    return (
      // Hack to force re-rendering on state change
      <div className={classnames({[styles.open]: this.state.open})}>
        <AsyncContentComponent reference={principalReference} render={this.renderContent}/>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const normalizedData = state.get('normalizedData').toJS();

  const { principalId, entitySetId } = ownProps;

  const entitySet = getEdmObjectSilent(normalizedData, createEntitySetReference(entitySetId), null);

  return {
    principalReference: createPrincipalReference(principalId),
    entitySet
  };
}

// TODO: Decide if/how to incorporate bindActionCreators
function mapDispatchToProps(dispatch) {
  return {
    loadPrincipal: (principalId) => {
      dispatch(PrincipalActionsFactory.loadPrincipalDetails(principalId));
    },
    updateStatuses: (statuses) => {
      dispatch(PermissionsActionFactory.updateStatusesStatusesRequest(statuses))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntitySetPermissionsRequest);