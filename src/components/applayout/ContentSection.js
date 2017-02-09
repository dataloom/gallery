/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';

import StyledFlexContainerStacked from '../flex/StyledFlexContainerStacked';
import StyledFlexContainerStackedCentered from '../flex/StyledFlexContainerStackedCentered';

const OuterSectionContainer = styled(StyledFlexContainerStackedCentered)`
  background-color: ${(props) => {
    return props.backgroundColor ? props.backgroundColor : 'transparent';
  }};
  border-bottom: ${(props) => {
    return props.borderBottom ? props.borderBottom : 'none';
  }}
`;

const InnerSectionContainer = styled(StyledFlexContainerStacked)`
  padding: 20px 0;
  width: ${(props) => {
    return props.width ? props.width : '1000px';
  }};
`;

export default class ContentSection extends React.Component {

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    styles: React.PropTypes.shape({
      backgroundColor: React.PropTypes.string,
      borderBottom: React.PropTypes.string,
      width: React.PropTypes.string
    })
  };

  static defaultProps = {
    styles: {}
  };

  render() {

    return (
      <OuterSectionContainer
          backgroundColor={this.props.styles.backgroundColor}
          borderBottom={this.props.styles.borderBottom}>
        <InnerSectionContainer width={this.props.styles.width}>
          { React.Children.toArray(this.props.children) }
        </InnerSectionContainer>
      </OuterSectionContainer>
    );
  }
}
