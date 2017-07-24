import React, { PropTypes } from 'react';

import styles from '../styles.module.css';

export class ReorderProperty extends React.Component {
  static propTypes = {
    item: PropTypes.object
  }

  render() {
    const item = this.props.item;
    return (
      <tr className={styles.tableRows}>
        <td className={styles.tableCell}>{item.type.name}</td>
        <td className={styles.tableCell}>{item.type.namespace}</td>
        <td className={styles.tableCell}>{item.title}</td>
      </tr>
    );
  }
}

export default ReorderProperty;
