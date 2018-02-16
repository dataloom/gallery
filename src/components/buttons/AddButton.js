import React from 'react';
import styled from 'styled-components';
import FontAwesome from 'react-fontawesome';

const StyledButton = styled.button`
  color: #39de9d;
  background: none;
  border: none;
  display: flex;
  flex: 0;
  margin: auto 5px;
  &:hover {
    color: #09a34d;
  }
  &:disabled {
    cursor: default;
  }
`;

export default class AddButton extends React.Component {

  static propTypes = {
    disabled: React.PropTypes.bool,
    onClick: React.PropTypes.func
  };

  render() {
    if (this.props.disabled) {
      return (
        <StyledButton disabled>
          <FontAwesome name="plus" />
        </StyledButton>
      );
    }

    return (
      <StyledButton onClick={this.props.onClick}>
        <FontAwesome name="plus" />
      </StyledButton>
    );
  }
}
