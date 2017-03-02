import React, { PropTypes } from 'react';
import { Cell } from 'fixed-data-table';
import styles from './styles.module.css';

export default class TextCell extends React.Component {
  static propTypes = {
    results: PropTypes.array,
    rowIndex: PropTypes.number,
    field: PropTypes.string,
    formatValueFn: PropTypes.func
  }

  render() {
    const { rowIndex, field, results, content } = this.props;
    console.log('results:', results);
    if (rowIndex !== undefined && field !== undefined) {
      return (
        <Cell>
          <div className={styles.textCell}>
            {this.props.formatValueFn(results[rowIndex][field])}
          </div>
        </Cell>
      );
    } else if (content !== undefined) {
      return (
        <Cell>
          <div className={styles.textCell}>
            {this.props.formatValueFn(content)}
          </div>
        </Cell>
      );
    }

  }
}
