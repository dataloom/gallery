/*
 * @flow
 */

import React from 'react';

import ContentContainer from '../../../components/applayout/ContentContainer';
import ContentSection from '../../../components/applayout/ContentSection';
import ContentHeaderSection from '../../../components/applayout/ContentHeaderSection';

import OrganizationsHeaderComponent from './OrganizationsHeaderComponent';

export default class OrganizationsContainerComponent extends React.Component {

  static propTypes = {
    children: React.PropTypes.node.isRequired
  }

  render() {

    return (
      <ContentContainer>
        <ContentHeaderSection>
          <OrganizationsHeaderComponent />
        </ContentHeaderSection>
        <ContentSection>
          { React.Children.toArray(this.props.children) }
        </ContentSection>
      </ContentContainer>
    );
  }

}
