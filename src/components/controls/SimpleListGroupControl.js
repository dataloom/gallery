/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import FontAwesome from 'react-fontawesome';
import styled from 'styled-components';

import StyledFlexContainerStackedLeftAligned from '../flex/StyledFlexContainerStackedLeftAligned';

const ListItemWrapper = styled.div`
  align-items: center;
  background: none;
  border: 1px solid #cfd8dc;
  display: flex;
  margin: -1px 0 0 0;
  width: 100%;
  &:first-child {
    margin: 0;
  }
`;

const ListItemButton = styled.button`
  background: none;
  border: none;
  flex: 0;
  margin: auto 12px;
  &.add {
    color: #39de9d;
  }
  &.remove {
    color: #e91e63;
  }
  &:focus {
    outline: none;
  }
`;

const ListItemValue = styled.span`
  background: none;
  border: none;
  flex: 1;
  padding: 10px 12px;
`;

const AddItemInput = styled.input`
  border: none;
  margin: 0;
  padding: 10px 12px;
  flex: 1;
  &:focus {
    outline: none;
  }
`;

let idCounter = 0;
function getUniqueId() {

  idCounter += 1;
  return idCounter;
}

/*
 * TODO: allow for a max count before scrollbar
 */

export default class SimpleListGroupControl extends React.Component {

  static propTypes = {
    placeholder: React.PropTypes.string,
    values: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.string),
      React.PropTypes.instanceOf(Immutable.List)
    ]).isRequired,
    isValid: React.PropTypes.func,
    viewOnly: React.PropTypes.bool,
    onAdd: React.PropTypes.func,
    onRemove: React.PropTypes.func
  };

  static defaultProps = {
    placeholder: '',
    viewOnly: false,
    isValid: () => {},
    onAdd: () => {},
    onRemove: () => {}
  };

  state :{
    inputValue :string,
    values :string[]
  }

  constructor(props :Object) {

    super(props);

    this.state = {
      inputValue: '',
      values: this.props.values
    };
  }

  addItem = () => {

    if (!this.state.inputValue) {
      return;
    }

    const isValid = this.props.isValid(this.state.inputValue);
    if (!isValid) {
      // update state to show a visual cue that the value is invalid
      return;
    }

    this.props.onAdd(this.state.inputValue);

    this.setState({
      inputValue: ''
    });
  }

  removeItem = (value :string) => {

    this.props.onRemove(value);
  }

  handleOnChange = (event :SyntheticInputEvent) => {

    this.setState({
      inputValue: event.target.value
    });
  }

  handleOnKeyDown = (event :SyntheticKeyboardEvent) => {

    switch (event.keyCode) {
      case 13: // 'Enter' key code
      case 27: // 'Esc' key code
        this.addItem();
        break;
      default:
        break;
    }
  }

  renderAddItemControl = () => {

    if (this.props.viewOnly) {
      return null;
    }

    return (
      <ListItemWrapper>
        <AddItemInput
            placeholder={this.props.placeholder}
            value={this.state.inputValue}
            onChange={this.handleOnChange}
            onKeyDown={this.handleOnKeyDown} />
        <ListItemButton className="add" onClick={this.addItem}>
          <FontAwesome name="plus" />
        </ListItemButton>
      </ListItemWrapper>
    );
  }

  renderListItems = () => {

    return this.props.values.map((value :string) => {
      return (
        <ListItemWrapper key={`${value}_${getUniqueId()}`}>
          <ListItemValue>
            { value }
          </ListItemValue>
          {
            this.props.viewOnly
              ? null
              : (
                <ListItemButton
                    className="remove"
                    onClick={() => {
                      this.removeItem(value);
                    }}>
                  <FontAwesome name="minus" />
                </ListItemButton>
              )
          }
        </ListItemWrapper>
      );
    });
  }

  render() {

    return (
      <StyledFlexContainerStackedLeftAligned>
        { this.renderAddItemControl() }
        { this.renderListItems() }
      </StyledFlexContainerStackedLeftAligned>
    );
  }
}
