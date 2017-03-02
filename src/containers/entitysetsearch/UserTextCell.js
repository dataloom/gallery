import React, { PropTypes } from 'react';
import { Cell } from 'fixed-data-table';
import styles from './styles.module.css';

export default class UserTextCell extends React.Component {
  static propTypes = {
    rowIndex: PropTypes.number,
    data: PropTypes.string,
    formatValueFn: PropTypes.func
  }

  render() {
    const { rowIndex, data } = this.props
    return (
      <Cell>
        <div className={styles.textCell}>
          {this.props.formatValueFn(data)}
        </div>
      </Cell>
    );
  }
}
