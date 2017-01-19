import React, { PropTypes } from 'react';

import { PropertyTypePropType } from './PropertyTypeStorage';
import ExpandableText from '../utils/ExpandableText';
import styles from './propertype.module.css';

const MAX_DESCRIPTION_LENGTH = 300;

// TODO: Make PropertyType a container that takes a PropertyType reference
export default class PropertyType extends React.Component {
  static propTypes = {
    propertyType: PropertyTypePropType.isRequired,
  };

  render() {
    const { propertyType } = this.props;

    let description;
    if (propertyType.description) {
      description = (<ExpandableText text={propertyType.description} maxLength={MAX_DESCRIPTION_LENGTH}/>);
    } else {
      description = (<em>No description</em>);
    }

    return (
      <div className={styles.propertyType}>
        <div className={styles.title}>{propertyType.title}</div>
        <div className={styles.description}>
          {description}
        </div>
      </div>
    );
  }
}