/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';

import StyledFlexContainerStacked from '../../../components/flex/StyledFlexContainerStacked';

import {
  AddButton,
  RemoveButton,
  StyledElement,
  StyledInput,
  StyledListItem
} from './StyledListGroupComponents';

let idCounter = 0;
function getUniqueId() {

  idCounter += 1;
  return idCounter;
}

/*
 * TODO: allow for a max count before scrollbar
 */

export default class SimpleListGroup extends React.Component {

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

  renderAddItemInputBox = () => {

    if (this.props.viewOnly) {
      return null;
    }

    return (
      <StyledListItem>
        <StyledInput
            type="text"
            placeholder={this.props.placeholder}
            value={this.state.inputValue}
            onChange={this.handleOnChange}
            onKeyDown={this.handleOnKeyDown} />
        <AddButton onClick={this.addItem} />
      </StyledListItem>
    );
  }

  renderListItems = () => {

    return this.props.values.map((value :string) => {
      return (
        <StyledListItem key={`${value}_${getUniqueId()}`}>
          <StyledElement>{ value }</StyledElement>
          {
            this.props.viewOnly
              ? null
              : (
                <RemoveButton
                    onClick={() => {
                      this.removeItem(value);
                    }} />
              )
          }
        </StyledListItem>
      );
    });
  }

  render() {

    return (
      <StyledFlexContainerStacked>
        { this.renderAddItemInputBox() }
        { this.renderListItems() }
      </StyledFlexContainerStacked>
    );
  }
}
