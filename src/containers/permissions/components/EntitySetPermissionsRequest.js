import {
  DataModels,
  Types
} from 'loom-data';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import groupBy from 'lodash/groupBy';
import FontAwesome from 'react-fontawesome';
import classnames from 'classnames';

import { EntitySetPropType } from '../../edm/EdmModel';
import { createPrincipalReference } from '../../principals/PrincipalsStorage';
import { getDisplayName, getEmail } from '../../principals/PrincipalUtils';
import { createEntitySetReference, getEdmObjectSilent } from '../../edm/EdmStorage';
import * as PermissionsActionFactory from '../PermissionsActionFactory';
import * as PrincipalsActionFactory from '../../principals/PrincipalsActionFactory';

import { createAsyncComponent } from '../../async/components/AsyncContentComponent';
import styles from './permissions.module.css';

const { RequestStatus } = DataModels;
const { RequestStateTypes } = Types;

class EntitySetPermissionsRequest extends React.Component {
  static propTypes = {
    principal: PropTypes.any,
    principalId: PropTypes.string.isRequired,
    entitySetId: PropTypes.string.isRequired,
    // statuses: PropTypes.arrayOf(RequestStatus).isRequired,

    // Saving
    updateStatuses: PropTypes.func.isRequired,
    // Loaders
    loadPrincipal: PropTypes.func.isRequired,

    // TODO: Move to AsyncReference
    entitySet: EntitySetPropType

  };

  constructor(props) {
    super(props);
    const selectedProperties = new Set();
    props.statuses.forEach((status) => {
      selectedProperties.add(status.request.aclKey[1]);
    });
    this.state = {
      open: false,
      // TODO: Move to Redux
      selectedProperties
    };
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
          .setIn(['request', 'aclKey', 1], propertyTypeId)
          .toJS();
        updatedStatuses.push(updatedStatus);
      });
      updateStatuses(updatedStatuses);
    }
  };

  approve = () => {
    this.sendUpdateRequests(RequestStateTypes.APPROVED);
  };

  deny = () => {
    this.sendUpdateRequests(RequestStateTypes.DECLINED);
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
  };

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
              }} />
        </div>
        <div className="propertyTypeTitle">
          <label htmlFor={`ptr-${principalId}-${propertyType.id}`}>{propertyType.title}</label>
        </div>
      </div>
    );
  }

  toggleBody = () => {
    this.setState({ open: !this.state.open });
  };

  render() {

    const { statuses, entitySet, principal } = this.props;
    const propertyTypes = entitySet.entityType.properties;
    const reasonList = new Set();
    statuses.forEach((status) => {
      reasonList.add(status.request.reason);
    });

    const reasons = [];
    reasonList.forEach((reason) => {
      reasons.push(<div key={reason} className={styles.requestMessage}>{reason}</div>);
    });

    const statusByPropertyTypeId = groupBy(statuses, (status) => {
      return status.request.aclKey[1];
    });
    const content = propertyTypes.map((propertyType) => {
      return this.renderProperty(principal.id, propertyType, statusByPropertyTypeId[propertyType.id]);
    });
    const principalDisplayName = `${getDisplayName(principal)} (${getEmail(principal)})`

    return (
      <div className={classnames({ [styles.open]: this.state.open })}>
        <div className={styles.permissionsRequest}>
          <div className={styles.permissionRequestHeader}>
            <div className={styles.permissionRequestTitle}>
              <span className={styles.principalName}>{principalDisplayName} </span>
              requested permission on
              <a onClick={this.toggleBody}> { statuses.length } properties</a>
            </div>
            <button className={styles.approveButton} onClick={this.approve}>
              <FontAwesome name="thumbs-o-up" />
              Allow
            </button>
            <button className={styles.rejectButton} onClick={this.deny}>
              <FontAwesome name="thumbs-o-down" />
              Deny
            </button>
          </div>

          <div className={styles.permissionRequestBody}>
            <div className={styles.subtitle}>Message:</div>
            {reasons}
            <div className={styles.subtitle}>Properties requested:</div>
            <div className="propertyTypeList">{ content }</div>
          </div>
        </div>
      </div>
    );
  }
}

EntitySetPermissionsRequest.Async = createAsyncComponent(EntitySetPermissionsRequest);

class EntitySetPermissionsRequestWrapper extends React.Component {

  static propTypes = {
    principalId: PropTypes.string.isRequired,
    loadPrincipal: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.loadPrincipal(this.props.principalId);
  }

  render() {

    const principalReference = createPrincipalReference(this.props.principalId);

    return (
      <EntitySetPermissionsRequest.Async
          principal={principalReference}
          {...this.props} />
    );
  }
}

EntitySetPermissionsRequestWrapper.Async = createAsyncComponent(EntitySetPermissionsRequestWrapper);

function mapStateToProps(state, ownProps) {

  const normalizedData = state.get('normalizedData').toJS();
  const { principalId, entitySetId } = ownProps;
  const entitySet = getEdmObjectSilent(normalizedData, createEntitySetReference(entitySetId), null);

  return {
    entitySet,
    principalId
  };
}

// TODO: Decide if/how to incorporate bindActionCreators
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadPrincipal: PrincipalsActionFactory.loadPrincipalDetails,
    updateStatuses: PermissionsActionFactory.updateStatusesRequest
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EntitySetPermissionsRequestWrapper.Async);
