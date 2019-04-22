/*
 * @flow
 */

import React from 'react';
import styled, { css } from 'styled-components';

const ToolbarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: ${props => (props.noPadding ? 0 : '20px')};
`;

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  border-top: 1px solid #ceced9;
  border-bottom: 1px solid #ceced9;
  border-right: 1px solid #ceced9;
  text-decoration: none;
  padding: 10px 50px;
  min-width: 130px;
  font-family: 'Open Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  background-color: ${props => (props.selected ? '#6124e2' : 'transparent')};
  color: ${props => (props.selected ? '#ffffff' : '#8e929b')};

  &:hover {
    cursor: pointer;

    ${(props) => {
      if (!props.selected) {
        return css`
          color: #6124e2;
          background-color: #e4d8ff;
        `;
      }
      return '';
    }}
  }

  &:focus {
    outline: none;
  }

  &:first-child {
    border-radius: 4px 0 0 4px;
    border-left: 1px solid #ceced9;
  }

  &:last-child {
    border-radius: 0 4px 4px 0;
  }
`;

type SearchOption = {
  onClick :() => void,
  value :string,
  label :string
};

type Props = {
  options :SearchOption[],
  value :string,
  noPadding? :boolean
}

const ButtonToolbar = ({ options, value, noPadding } :Props) => (
  <ToolbarWrapper noPadding={noPadding}>
    { options.map(option => (
      <StyledButton
          key={option.value}
          onClick={option.onClick}
          selected={option.value === value}>
        {option.label}
      </StyledButton>
    )) }
  </ToolbarWrapper>
);

ButtonToolbar.defaultProps = {
  noPadding: false
};

export default ButtonToolbar;
