import React, { PropTypes } from 'react';

import ActionDropdown from './ActionDropdown';
import { EntitySetPropType } from '../../containers/edm/EdmModel';
import ExpandableText from '../utils/ExpandableText';
import styles from './entityset.module.css';

const MAX_DESCRIPTION_LENGTH = 300;

/* EntitySet Components */
export default class EntitySet extends React.Component {
  static propTypes = {
    entitySet: EntitySetPropType.isRequired
  };

  render() {
    const { entitySet } = this.props;

    let description;
    if (entitySet.description) {
      description = (<ExpandableText maxLength={MAX_DESCRIPTION_LENGTH} text={entitySet.description}/>);
    } else {
      description = (<em>No description available</em>);
    }

    return (
      <article className={styles.entitySet}>
        <header>
          <h2 className={styles.title}>
            {entitySet.title}
            <small className={styles.subtitle}>{entitySet.type.namespace}.{entitySet.type.name}</small>
          </h2>

          <div className={styles.controls}>
            <ActionDropdown entitySet={entitySet} showDetails={true}/>
          </div>
        </header>
        {description}
      </article>
    );
  }
}
