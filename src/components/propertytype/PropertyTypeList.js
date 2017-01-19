import React, { PropTypes } from 'react';

import { PropertyTypePropType } from './PropertyTypeStorage';
import PropertyType from './PropertyType';
import styles from './propertype.module.css';

// TODO: make PropertyTypeList a container that takes a list of PropertyType references
export default class PropertyTypeList extends React.Component {
  static propTypes = {
    propertyTypes: PropTypes.arrayOf(PropertyTypePropType).isRequired
  };

  render() {
    const { propertyTypes } = this.props;

    let content;
    if (propertyTypes.length > 0) {
      content = propertyTypes.map((propertyType) => {
        return (<PropertyType propertyType={propertyType} key={propertyType.id}/>);
      });
    } else {
      content = (<em>No property types</em>);
    }

    return (
      <div className={styles.propertyTypeList}>
        <div className={styles.propertyTypeListHeader}>
          <div className={styles.title}>Property Title</div>
          <div className={styles.description}>Description</div>
        </div>
        {content}
      </div>
    );
  }
}