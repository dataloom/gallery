import React from 'react';
import { Button } from 'react-bootstrap';
import styles from './styles.module.css';

const requests = [
  {
    email: 'givemeaccesspls@gmail.com',
    dataset: 'MHS Data',
    msg: 'Hi! I would like to have access to your dataset please. It would be very helpful to me to have access to this thing for a variety of interesting and convincing reasons! Give it to me please.',
    time: Date.now()
  },
  {
    email: 'katherine@kryptnostic.com',
    dataset: 'Kryptnostic',
    msg: 'please let me see the data :)',
    time: Date.now()
  }
];

export class Home extends React.Component {

  render() {

    const allRequests = requests.map((request) => {
      return (
        <div>
          <div>{request.time}</div>
          <div>{request.email} requests access to {request.dataset}</div>
          <div>{request.msg}</div>
          <div>
            <Button>Approve</Button>
            <Button>Deny</Button>
          </div>
        </div>
      );
    });

    return (
      <div>
        <div>
          <div className={styles.sectionHeader}>Pending Action Items</div>
          {allRequests}
        </div>
        <div className={styles.spacer} />
        <div>
          <div className={styles.sectionHeader}>Activity</div>
        </div>
      </div>
    );
  }
}

export default Home;
