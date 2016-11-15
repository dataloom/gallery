import React from 'react';
import { PermissionsApi } from 'loom-data';
import { Promise } from 'bluebird';
import Consts from '../../../utils/AppConsts';
import styles from './styles.module.css';

const authConsts = {
  0: '',
  1: 'granted',
  2: 'denied'
};

export class Home extends React.Component {

  constructor() {
    super();
    this.state = {
      resolved: {},
      requests: []
    };
  }

  componentDidMount() {
    this.loadRequestStatuses();
  }

  shouldShow = {
    true: Consts.EMPTY,
    false: styles.hidden
  }

  loadRequestStatuses = () => {
    PermissionsApi.getAllReceivedRequestsForPermissions()
    .then((requests) => {
      const map = this.state.resolved;
      requests.forEach((request) => {
        map[request.requestId] = 0;
      });
      this.setState({ resolved: map, requests });
    });
  }

  respondToRequest = (approvalGranted, email, entitySet, requestId, permissions) => {
    const map = this.state.resolved;
    map[requestId] = (approvalGranted) ? 1 : 2;
    if (approvalGranted) {
      Promise.join(
        PermissionsApi.updateAclsForEntitySets([{
          principal: {
            type: Consts.USER,
            name: email
          },
          action: Consts.SET,
          name: entitySet,
          permissions
        }]),
        PermissionsApi.removePermissionsRequestForEntitySet(requestId),
        () => {
          this.setState({ resolved: map });
        }
      );
    }
    else {
      PermissionsApi.removePermissionsRequestForEntitySet(requestId)
      .then(() => {
        this.setState({ resolved: map });
      });
    }
    this.setState({ resolved: map });
  }

  getPermissionType(permissions) {
    if (permissions.includes(Consts.WRITE.toUpperCase())) return Consts.WRITE;
    return Consts.READ;
  }

  renderAllRequests = () => {
    if (this.state.requests.length === 0) {
      return (
        <div className={styles.objContainer}>
          <div className={styles.noRequests}>You have no action items.</div>
        </div>
      );
    }
    return this.state.requests.map((request) => {
      const reqStatus = this.state.resolved[request.requestId];
      const email = request.principal.name;
      const entitySet = request.name;
      const permissions = request.permissions;
      const requestId = request.requestId;

      return (
        <div className={styles.objContainer} key={requestId}>
          <div className={this.shouldShow[(reqStatus === 0)]}>
            <div>{(request.timestamp)}</div>
            <div>
              <div className={styles.important}>{email}</div>
              <div className={styles.inline}> requests {this.getPermissionType(permissions)} access to </div>
              <div className={styles.important}>{entitySet}</div>
            </div>
            <div className={styles.spacerSmall} />
            <div>
              <button
                className={styles.genericButton}
                onClick={() => {
                  this.respondToRequest(true, email, entitySet, requestId, permissions);
                }}
              >Approve</button>
              <div className={styles.extraMargin}>
                <button
                  className={styles.genericButton}
                  onClick={() => {
                    this.respondToRequest(false, email, entitySet, requestId, permissions);
                  }}
                >Deny</button>
              </div>
            </div>
          </div>
          <div className={this.shouldShow[(reqStatus !== 0)]}>
            You have {authConsts[reqStatus]} {email} {this.getPermissionType(permissions)} access to {entitySet}.
          </div>
        </div>
      );
    });
  }

  renderActivity = () => {
    const activity = [{}];
    return activity.map((event) => {
      return (
        <div className={styles.objContainer} key={event.key}>
          <div>{this.getDateTimeFormatted(event.time)}</div>
          <div>{event.activity}</div>
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        <div>
          <h2 className={styles.sectionHeader}>Pending Action Items</h2>
          {this.renderAllRequests()}
        </div>
        <div className={styles.spacer} />
      </div>
    );
  }
}

export default Home;
