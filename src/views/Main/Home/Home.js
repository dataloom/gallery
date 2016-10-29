import React from 'react';
import styles from './styles.module.css';

export class Home extends React.Component {

  render() {
    return (
      <div>
        <div>
          <div className={styles.sectionHeader}>Pending Action Items</div>
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
