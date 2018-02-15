import React from 'react';

import ContentContainer from '../../../components/applayout/ContentContainer';
import ContentSection from '../../../components/applayout/ContentSection';
import ContentHeaderSection from '../../../components/applayout/ContentHeaderSection';

import OrganizationsHeaderComponent from './OrganizationsHeaderComponent';

export default class OrganizationsContainerComponent extends React.Component {

  static propTypes = {
    auth: React.PropTypes.object.isRequired,
    children: React.PropTypes.node.isRequired
  }

  render() {

    const childrenWithProps = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        auth: this.props.auth
      });
    });

    return (
      <ContentContainer>
        <ContentHeaderSection>
          <OrganizationsHeaderComponent />
        </ContentHeaderSection>
        <ContentSection>
          { React.Children.toArray(childrenWithProps) }
        </ContentSection>
      </ContentContainer>
    );
  }

}
