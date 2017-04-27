import React, { PropTypes } from 'react';
import { Cell } from 'fixed-data-table';
import styles from './styles.module.css';

export default class TextCell extends React.Component {
  static propTypes = {
    results: PropTypes.array,
    rowIndex: PropTypes.number,
    field: PropTypes.string,
    formatValueFn: PropTypes.func,
    onClick: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    entitySetId: PropTypes.string,
    propertyTypes: PropTypes.array.isRequired
  }

  getClassName = () => {
    return (this.props.entitySetId) ? styles.textCell : styles.textCellUnclickable;
  }

  getOnClickFn = () => {
    const { rowIndex, results, entitySetId, propertyTypes } = this.props;
    const rowValues = {};
    propertyTypes.forEach((propertyType) => {
      const fqn = `${propertyType.type.namespace}.${propertyType.type.name}`;
      const value = results[rowIndex][fqn] || results[rowIndex][propertyType.id];
      if (value) rowValues[fqn] = value;
    });
    if (this.props.entitySetId) {
      return () => {
        this.props.onClick(results[rowIndex].id, rowValues, entitySetId, propertyTypes);
      };
    }
    return () => {};
  }

  render() {
    const { rowIndex, field, results, width } = this.props;
    return (
      <Cell>
        <div className={this.getClassName()} onClick={this.getOnClickFn()} style={{ width }}>
          {this.props.formatValueFn(results[rowIndex][field])}
        </div>
      </Cell>
    );
  }
}
