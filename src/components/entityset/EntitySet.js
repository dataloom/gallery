import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';

import ActionDropdown from '../../containers/edm/components/ActionDropdown';
import ExpandableText from '../utils/ExpandableText';

import styles from './entityset.module.css';

const MAX_DESCRIPTION_LENGTH = 300;

/* EntitySet Components */
export default class EntitySet extends React.Component {

  static propTypes = {
    entitySet: PropTypes.instanceOf(Immutable.Map).isRequired
  };

  render() {

    const { entitySet } = this.props;

    let description;
    if (entitySet.get('description')) {
      description = (<ExpandableText maxLength={MAX_DESCRIPTION_LENGTH} text={entitySet.get('description')} />);
    }
    else {
      description = (<em>No description available</em>);
    }

    let contact;
    if (!entitySet.get('contacts').isEmpty()) {
      const formattedContacts = entitySet.get('contacts').join(', ');
      contact = (<em className={styles.contacts}>{formattedContacts}</em>);
    }
    else {
      contact = (<em className={styles.contacts}>No contact information available.</em>);
    }

    return (
      <article className={styles.entitySet}>
        <header>
          <h2 className={styles.title}>
            {entitySet.get('title')}
          </h2>

          <div className={styles.controls}>
            <ActionDropdown entitySetId={entitySet.get('id')} showDetails />
          </div>
          {contact}
        </header>
        {description}
      </article>
    );
  }
}
