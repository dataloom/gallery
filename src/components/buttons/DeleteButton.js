/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';
import FontAwesome from 'react-fontawesome';

const StyledButton = styled.button`
  color: #e91e63;
  background: none;
  border: none;
  display: flex;
  flex: 0;
  margin: auto 5px;
  &:hover {
    color: #b90b14;
  }
  &:disabled {
    cursor: default;
  }
`;

export default class DeleteButton extends React.Component {

  static propTypes = {
    disabled: React.PropTypes.bool,
    onClick: React.PropTypes.func
  };

  render() {
    if (this.props.disabled) {
      return (
        <StyledButton disabled>
          <FontAwesome name="minus" />
        </StyledButton>
      );
    }

    return (
      <StyledButton onClick={this.props.onClick}>
        <FontAwesome name="minus" />
      </StyledButton>
    );
  }
}
