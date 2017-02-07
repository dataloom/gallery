/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';

import StyledStackedFlexContainer from '../flex/StyledStackedFlexContainer';

const FlexSection = styled(StyledStackedFlexContainer)`
  align-items: center;
  padding: 25px 0;
  background-color: ${(props) => {
    return props.backgroundColor ? props.backgroundColor : 'transparent';
  }};
  border-bottom: ${(props) => {
    return props.borderBottom ? props.borderBottom : 'none';
  }}
`;

const FixedWidthFlexSection = styled(StyledStackedFlexContainer)`
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
      <FlexSection
          backgroundColor={this.props.styles.backgroundColor}
          borderBottom={this.props.styles.borderBottom}>
        <FixedWidthFlexSection width={this.props.styles.width}>
          { React.Children.toArray(this.props.children) }
        </FixedWidthFlexSection>
      </FlexSection>
    );
  }
}
