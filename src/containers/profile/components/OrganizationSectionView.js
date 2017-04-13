import React, { PropTypes } from 'react';

import ProfileSectionWrapper from '../../../components/profile/ProfileSectionWrapper';

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
    <ProfileSectionWrapper header="Your Organizations">
      {renderContent(content)}
    </ProfileSectionWrapper>
  );
};

OrganizationSectionView.propTypes = {
  header: PropTypes.string.isRequired,
  content: PropTypes.array.isRequired
};

export default OrganizationSectionView;
