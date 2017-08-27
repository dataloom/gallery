import React, { PropTypes } from 'react';
import { Cell } from 'fixed-data-table';
import RowImage from './components/RowImage';
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
    propertyTypes: PropTypes.array.isRequired,
    renderImage: PropTypes.bool
  }

  getClassName = () => {
    return (this.props.entitySetId) ? styles.textCell : styles.textCellUnclickable;
  }

  getOnClickFn = () => {
    const { rowIndex, results, entitySetId, propertyTypes } = this.props;
    const rowValues = {};
    propertyTypes.forEach((propertyType) => {
      const fqn = `${propertyType.type.namespace}.${propertyType.type.name}`;
      const value = results[rowIndex][fqn];
      if (value) rowValues[fqn] = value;
    });
    if (this.props.entitySetId) {
      return () => {
        this.props.onClick(results[rowIndex].id[0], rowValues, entitySetId, propertyTypes);
      };
    }
    return () => {};
  }

  renderImage = () => {
    const { rowIndex, field, results } = this.props;
    const value = results[rowIndex][field];
    if (!value) return '';
    let counter = 0;
    const images = value.map((imgSrc) => {
      counter += 1;
      return <RowImage key={`${field}-${counter}`} imgSrc={imgSrc} />;
    });
    return <div className={styles.imgDataContainer}>{images}</div>;
  }

  render() {
    const { rowIndex, field, results, width, renderImage } = this.props;
    const content = (renderImage) ? this.renderImage() : this.props.formatValueFn(results[rowIndex][field]);
    return (
      <Cell>
        <div className={this.getClassName()} onClick={this.getOnClickFn()} style={{ width }}>
          {content}
        </div>
      </Cell>
    );
  }
}
