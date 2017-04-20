import React, { PropTypes } from 'react';

import ProfileSectionWrapper from '../../../components/profile/ProfileSectionWrapper';
import styles from '../styles.module.css';

const renderContent = (content) => {
  const renderedUserOrgs = content.map((org) => {
    return (
      <div className={styles.orgWrapper} key={org.id}>
        <div className={styles.orgTitle}>
          {org.title}
        </div>
        <div className={styles.orgRoles}>
          Roles: {org.roles}
        </div>
      </div>
    );
  });

  return renderedUserOrgs;
}

const OrganizationSectionView = ({ header, content }) => {
  return (
    <ProfileSectionWrapper header="Your Organizations">
      <div className={styles.contentWrapper}>
        {content.length > 0 ? renderContent(content) : 'You\'re not a member of any organizations yet.'}
      </div>
    </ProfileSectionWrapper>
  );
};

OrganizationSectionView.propTypes = {
  header: PropTypes.string.isRequired,
  content: PropTypes.array.isRequired
};

export default OrganizationSectionView;
