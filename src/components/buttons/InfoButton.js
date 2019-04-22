import React from 'react';
import styled from 'styled-components';

const InfoButton = styled.button`
  border-radius: 3px;
  background-color: #6124e2;
  color: #ffffff;
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  padding: 10px;
  width: ${props => (props.fullSize ? '100%' : 'fit-content')};

  &:hover {
    background-color: #8045ff;
    cursor: pointer;
  }

  &:active {
    background-color: #361876;
  }

  &:disabled {
    background-color: #f0f0f7;
    color: #b6bbc7;
    border: none;

    &:hover {
      cursor: default;
    }
  }

  &:focus {
    outline: none;
  }
`;

export default InfoButton;
