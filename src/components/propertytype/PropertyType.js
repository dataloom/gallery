import React, { PropTypes } from 'react';

import { PropertyTypePropType } from './PropertyTypeStorage';
import styles from './propertype.module.css';

export default class PropertyType extends React.Component {
  static propTypes = {
    propertyType: PropertyTypePropType.isRequired,
  };

  render() {
    const { propertyType } = this.props;

    let description;
    if (propertyType.description) {
      description = propertyType.description;
    } else {
      description = (<em>No description</em>);
    }

    return (
      <div className={styles.propertyType}>
        <div className={styles.title}>{propertyType.title}</div>
        <div className={styles.description}>{description}</div>
      </div>
    );
  }
}