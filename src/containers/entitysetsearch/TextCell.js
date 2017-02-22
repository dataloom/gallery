import React, { PropTypes } from 'react';
import { Cell } from 'fixed-data-table';

export default class TextCell extends React.Component {
  static propTypes = {
    results: PropTypes.array,
    rowIndex: PropTypes.number,
    field: PropTypes.string,
    formatValueFn: PropTypes.func
  }

  render() {
    const { rowIndex, field, results } = this.props
    return (
      <Cell>
        {this.props.formatValueFn(results[rowIndex][field])}
      </Cell>
    );
  }
}
