/*
 * @flow
 */

import React from 'react';

import FontAwesome from 'react-fontawesome';
import styled from 'styled-components';

import StyledFlexContainer from '../../../components/flex/StyledFlexContainer';

export const StyledListItem = styled(StyledFlexContainer)`
  background-color: #ffffff;
  border: 1px solid #cfd8dc;
  flex: 1 0 auto;
  margin-top: -1px;
  padding: 0 5px;
  &:first-child {
    margin: 0;
  }
`;

export const StyledElement = styled.span`
  background: none;
  border: none;
  display: flex;
  flex: 1 0 auto;
  margin: auto 5px;
  padding: 10px 0;
`;

export const StyledIcon = styled.span`
  background: none;
  border: none;
  display: flex;
  flex: 0;
  margin: auto 5px;
  padding: 10px 0;
`;

export const StyledInput = styled.input`
  background: none;
  border: none;
  display: flex;
  flex: 1 0 auto;
  margin: auto 5px;
  padding: 10px 0;
  &:focus {
    outline: none;
  }
`;

export const StyledButton = styled.button`
  background: none;
  border: none;
  display: flex;
  flex: 0;
  margin: auto 5px;
  &:focus {
    outline: none;
  }
`;

const StyledAddButton = styled(StyledButton)`
  color: #39de9d;
`;

const StyledRemoveButton = styled(StyledButton)`
  color: #e91e63;
`;

const StyledSearchIcon = styled(StyledIcon)`
  padding: 0;
`;

export const AddButton = (props :Object) => {

  return (
    <StyledAddButton onClick={props.onClick}>
      <FontAwesome name="plus" />
    </StyledAddButton>
  );
};

export const RemoveButton = (props :Object) => {

  return (
    <StyledRemoveButton onClick={props.onClick}>
      <FontAwesome name="minus" />
    </StyledRemoveButton>
  );
};

export const SearchIcon = () => {

  return (
    <StyledSearchIcon>
      <FontAwesome name="search" />
    </StyledSearchIcon>
  );
};
