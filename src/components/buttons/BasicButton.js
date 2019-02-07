import styled from 'styled-components';

const BasicButton = styled.button`
  border: none;
  border-radius: 3px;
  background-color: #f0f0f7;
  color: #8e929b;
  font-family: 'Open Sans', sans-serif;
  padding: 12px 35px;
  font-size: 14px;
  justify-content: center;
  text-align: center;

  &:hover:enabled {
    background-color: #dcdce7;
    cursor: pointer;
  }

  &:active {
    background-color: #b6bbc7;
    color: #ffffff;
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    color: #b6bbc7;
  }
`;

export default BasicButton;
