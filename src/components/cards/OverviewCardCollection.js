/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';

import StyledStackedFlexContainer from '../flex/StyledStackedFlexContainer';

export default class OverviewCardCollection extends React.Component {

  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  render() {

    return (
      <StyledStackedFlexContainer>
        { React.Children.toArray(this.props.children) }
      </StyledStackedFlexContainer>
    );
  }
}
