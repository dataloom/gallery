import React from 'react';
import { Button } from 'react-bootstrap';
import Consts from '../../../utils/AppConsts';
import styles from './styles.module.css';

const requests = [
  {
    email: 'givemeaccesspls@gmail.com',
    dataset: 'MHS Data',
    msg: 'Hi! I would like to have access to your dataset please. It would be very helpful to me to have access to this thing for a variety of interesting and convincing reasons! Give it to me please.',
    time: Date.now(),
    key: '0'
  },
  {
    email: 'katherine@kryptnostic.com',
    dataset: 'Kryptnostic',
    msg: 'please let me see the data :)',
    time: Date.now(),
    key: '1'
  }
];

const activity = [
  {
    time: Date.now(),
    activity: 'Something tremendously exciting happened.'
  },
  {
    time: Date.now(),
    activity: 'This one is a bit less important.'
  }
];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const authConsts = {
  0: '',
  1: 'granted',
  2: 'denied'
};

export class Home extends React.Component {

  constructor() {
    super();
    this.state = {
      resolved: {}
    };
    this.loadThings();
  }

  shouldShow = {
    true: Consts.EMPTY,
    false: styles.hidden
  }

  loadThings = () => {
    const map = this.state.resolved;
    requests.forEach((request) => {
      map[request.key] = 0;
    });
    this.setState({ resolved: map });
  }

  getDateTimeFormatted(datetimeStr) {
    const datetime = new Date(datetimeStr);
    const month = months[datetime.getMonth()];
    const date = datetime.getDate().toString();
    const year = datetime.getFullYear().toString();
    const hour = datetime.getHours();
    const ampm = (hour < 12) ? 'am' : 'pm';
    const minutes = datetime.getMinutes();
    const minuteStr = (minutes.toString().length < 2) ? `0${minutes.toString()}` : minutes.toString();
    const hourStr = (hour % 12 === 0) ? '12' : (hour % 12).toString();
    return `${month} ${date}, ${year} at ${hourStr}:${minuteStr}${ampm}`;
  }

  respondToRequest = (approvalGranted, email, dataset, key) => {
    const map = this.state.resolved;
    map[key] = (approvalGranted) ? 1 : 2;
    this.setState({ resolved: map });
  }

  renderAllRequests = () => {
    return requests.map((request) => {
      const reqStatus = this.state.resolved[request.key];
      return (
        <div className={styles.objContainer}>
          <div className={this.shouldShow[(reqStatus === 0)]}>
            <div>{this.getDateTimeFormatted(request.time)}</div>
            <div>
              <div className={styles.important}>{request.email}</div>
              <div className={styles.inline}> requests access to </div>
              <div className={styles.important}>{request.dataset}</div>
            </div>
            <div className={styles.spacerSmall} />
            <div>{request.msg}</div>
            <div className={styles.spacerSmall} />
            <div>
              <Button
                onClick={() => {
                  this.respondToRequest(true, request.email, request.dataset, request.key);
                }}
              >Approve</Button>
              <Button
                onClick={() => {
                  this.respondToRequest(false, request.email, request.dataset, request.key);
                }}
              >Deny</Button>
            </div>
          </div>
          <div className={this.shouldShow[(reqStatus !== 0)]}>
            You have {authConsts[reqStatus]} {request.email} access to {request.dataset}
          </div>
        </div>
      );
    });
  }

  renderActivity = () => {
    return activity.map((event) => {
      return (
        <div className={styles.objContainer}>
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
        <div>
          <h2 className={styles.sectionHeader}>Activity</h2>
          {this.renderActivity()}
        </div>
      </div>
    );
  }
}

export default Home;
