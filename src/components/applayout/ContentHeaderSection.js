/*
 * @flow
 */

import React from 'react';

import ContentSection from './ContentSection';

const DEFAULT_BG_COLOR = '#f3f5f7';
const DEFAULT_BORDER_BOTTOM = '1px solid #eceff1';

export default class ContentHeaderSection extends React.Component {

  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  render() {

    const contentSectionStyles = {
      backgroundColor: DEFAULT_BG_COLOR,
      borderBottom: DEFAULT_BORDER_BOTTOM
    };

    return (
      <ContentSection styles={contentSectionStyles}>
        { React.Children.toArray(this.props.children) }
      </ContentSection>
    );
  }
}
