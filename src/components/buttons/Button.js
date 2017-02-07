/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: #4203c5;
  border: none;
  border-radius: 4px;
  color: #ffffff;
  cursor: pointer;
  padding: 6px 12px;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  &:hover {
    background-color: #2e0289;
  }
`;

export default class Button extends React.Component {

  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  render() {

    return (
      <StyledButton>
        { React.Children.toArray(this.props.children) }
      </StyledButton>
    );
  }
}
