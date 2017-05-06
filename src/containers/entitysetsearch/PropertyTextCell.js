import React, { PropTypes } from 'react';
import { Cell } from 'fixed-data-table';
import styles from './styles.module.css';

export default class PropertyTextCell extends React.Component {
  static propTypes = {
    rowIndex: PropTypes.number,
    data: PropTypes.array
  }

  render() {
    const { rowIndex, data } = this.props;
    return (
      <Cell>
        <div className={styles.textCell}>
          {data[rowIndex]}
        </div>
      </Cell>
    );
  }
}
