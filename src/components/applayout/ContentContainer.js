/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';

import StyledStackedFlexContainer from '../flex/StyledStackedFlexContainer';

const StackedFlexContainer = styled(StyledStackedFlexContainer)`
  flex: 1 0 auto;
`;

export default class ContentContainer extends React.Component {

  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  render() {

    return (
      <StackedFlexContainer>
        { React.Children.toArray(this.props.children) }
      </StackedFlexContainer>
    );
  }

}
