import React, { PropTypes } from 'react';
import { Cell } from 'fixed-data-table';

export default class TextCell extends React.Component {
  static propTypes = {
    results: PropTypes.array,
    rowIndex: PropTypes.number,
    field: PropTypes.string
  }

  render() {
    const { rowIndex, field, results } = this.props;
    return (
      <Cell>
        {results[rowIndex][field]}
      </Cell>
    );
  }
}
