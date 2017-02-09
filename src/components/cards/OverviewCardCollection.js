/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';

import StyledFlexContainerStacked from '../flex/StyledFlexContainerStacked';

export default class OverviewCardCollection extends React.Component {

  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  render() {

    return (
      <StyledFlexContainerStacked>
        { React.Children.toArray(this.props.children) }
      </StyledFlexContainerStacked>
    );
  }
}
