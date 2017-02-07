/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import ContentContainer from '../../../components/applayout/ContentContainer';
import ContentSection from '../../../components/applayout/ContentSection';
import ContentHeaderSection from '../../../components/applayout/ContentHeaderSection';

import OrganizationsHeaderComponent from './OrganizationsHeaderComponent';
import OrganizationsListComponent from './OrganizationsListComponent';

function mapStateToProps(state :Immutable.Map<*, *>) {

  return {};
}

function mapDispatchToProps(dispatch :Function) {

  return {};
}

class OrganizationsContainer extends React.Component {

  render() {

    return (
      <ContentContainer>
        <ContentHeaderSection>
          <OrganizationsHeaderComponent />
        </ContentHeaderSection>
        <ContentSection>
          <OrganizationsListComponent />
        </ContentSection>
      </ContentContainer>
    );
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationsContainer);
