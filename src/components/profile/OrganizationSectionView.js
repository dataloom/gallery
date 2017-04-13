import React, { PropTypes } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import styles from './styles.module.css';

const renderContent = (content) => {
  const yourOrgs = content.yourOrgs.map((org) => {
    return (
      <div key={org.get('id')}>
        {org.get('title')} (Owner)
      </div>
    );
  });

  const memberOfOrgs = content.memberOfOrgs.map((org) => {
    return (
        <div key={org.get('id')}>
          {org.get('title')}
        </div>
    );
  });

  return yourOrgs.concat(memberOfOrgs);
}

const OrganizationSectionView = ({ header, content }) => {
  return (
    <form className={styles.profileFormWrapper}>
      <div className={styles.header}>
        {header}
      </div>
      <div className={styles.sectionContent}>
        {renderContent(content)}
      </div>
    </form>
  );
};

OrganizationSectionView.propTypes = {
  header: PropTypes.string.isRequired,
  content: PropTypes.array.isRequired
};

export default OrganizationSectionView;
