/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: #4203c5;
  border: 1px solid #4203c5;
  border-radius: 4px;
  color: #ffffff;
  cursor: pointer;
  padding: 6px 12px;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  &:hover {
    background-color: #2e0289;
    border: 1px solid #2e0289;
  }
  &:disabled {
    cursor: default;
    background-color: #2e0289;
    border: 1px solid #2e0289;
  }
`;

export default class Button extends React.Component {

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    disabled: React.PropTypes.bool,
    onClick: React.PropTypes.func
  };

  render() {

    // TODO: this can be probably done better. look at react-bootstrap for inspiration
    if (this.props.disabled) {
      return (
        <StyledButton disabled>
          { React.Children.toArray(this.props.children) }
        </StyledButton>
      );
    }

    return (
      <StyledButton onClick={this.props.onClick}>
        { React.Children.toArray(this.props.children) }
      </StyledButton>
    );
  }
}
