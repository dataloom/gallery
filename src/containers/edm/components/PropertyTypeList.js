import React, { PropTypes } from 'react';

import PropertyType from './PropertyType';
import styles from './propertype.module.css';

// TODO: make PropertyTypeList a container that takes a list of PropertyType references
export default class PropertyTypeList extends React.Component {
  static propTypes = {
    propertyTypeIds: PropTypes.arrayOf(PropTypes.string).isRequired
  };

  render() {
    const { propertyTypeIds } = this.props;

    let content;
    if (propertyTypeIds.length > 0) {
      content = propertyTypeIds.map((id) => {
        return (<PropertyType propertyTypeId={id} key={id}/>);
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