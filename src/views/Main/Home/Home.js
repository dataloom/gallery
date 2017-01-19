import React, { PropTypes } from 'react';
import { PermissionsApi } from 'loom-data';
import { Promise } from 'bluebird';
import StringConsts from '../../../utils/Consts/StringConsts';
import UserRoleConsts from '../../../utils/Consts/UserRoleConsts';
import ActionConsts from '../../../utils/Consts/ActionConsts';
import styles from './styles.module.css';

const authConsts = {
  0: '',
  1: 'granted',
  2: 'denied'
};

export class Home extends React.Component {
  static propTypes = {
    updateTopbarFn: PropTypes.func
  }

  constructor() {
    super();
    this.state = {
      resolved: {},
      requests: [],
      loadRequestsError: false,
      respondToRequestError: false
    };
  }

  componentDidMount() {
    setTimeout(this.props.updateTopbarFn, 300);
    this.loadRequestStatuses();
  }

  shouldShow = {
    true: StringConsts.EMPTY,
    false: styles.hidden
  }

  errorClass = {
    true: styles.errorMsg,
    false: styles.hidden
  }

  loadRequestStatuses = () => {
    PermissionsApi.getAllReceivedRequestsForPermissions()
    .then((requests) => {
      const map = this.state.resolved;
      requests.forEach((requestObj) => {
        map[requestObj.request.requestId] = 0;
      });
      this.setState({
        resolved: map,
        requests,
        loadRequestsError: false
      });
    }).catch(() => {
      this.setState({ loadRequestsError: true });
    });
  }

  respondToRequest = (approvalGranted, id, entitySet, requestId, permissions) => {
    const map = this.state.resolved;
    map[requestId] = (approvalGranted) ? 1 : 2;
    if (approvalGranted) {
      Promise.join(
        PermissionsApi.updateAclsForEntitySets([{
          principal: {
            type: UserRoleConsts.USER,
            id
          },
          action: ActionConsts.SET,
          name: entitySet,
          permissions
        }]),
        PermissionsApi.removePermissionsRequestForEntitySet(requestId),
        () => {
          this.setState({
            resolved: map,
            respondToRequestError: false
          });
        }
      ).catch(() => {
        this.setState({ respondToRequestError: true });
      });
    }
    else {
      PermissionsApi.removePermissionsRequestForEntitySet(requestId)
      .then(() => {
        this.setState({
          resolved: map,
          respondToRequestError: false
        });
      }).catch(() => {
        this.setState({ respondToRequestError: true });
      });
    }
  }

  getPermissionType(permissions) {
    if (permissions.includes(ActionConsts.WRITE)) return ActionConsts.WRITE.toLowerCase();
    return ActionConsts.READ.toLowerCase();
  }

  renderAllRequests = () => {
    const { requests, resolved } = this.state;
    if (requests.length === 0) {
      return (
        <div className={styles.objContainer}>
          <div className={styles.noRequests}>You have no action items.</div>
        </div>
      );
    }
    return requests.map((requestObj) => {
      const request = requestObj.request;
      const reqStatus = resolved[request.requestId];
      const email = request.principal.name;
      const id = request.principal.id;
      const entitySet = request.name;
      const permissions = request.permissions;
      const requestId = request.requestId;

      return (
        <div className={styles.objContainer} key={requestId}>
          <div className={this.errorClass[this.state.respondToRequestError]}>Unable to respond to request.</div>
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
                  this.respondToRequest(true, id, entitySet, requestId, permissions);
                }}
              >Approve</button>
              <div className={styles.extraMargin}>
                <button
                  className={styles.genericButton}
                  onClick={() => {
                    this.respondToRequest(false, id, entitySet, requestId, permissions);
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
          <div className={this.errorClass[this.state.loadRequestsError]}>Unable to load permissions requests.</div>
          {this.renderAllRequests()}
        </div>
        <div className={styles.spacer} />
      </div>
    );
  }
}

export default Home;
