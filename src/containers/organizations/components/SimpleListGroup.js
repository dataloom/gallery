/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';

import StyledFlexContainerStacked from '../../../components/flex/StyledFlexContainerStacked';

import {
  AddButton,
  RemoveButton,
  StyledElement,
  StyledInput,
  StyledListItem
} from './StyledListGroupComponents';

/*
 * TODO: allow for a max count before scrollbar
 */

export default class SimpleListGroup extends React.Component {

  static propTypes = {
    placeholder: PropTypes.string,
    items: PropTypes.instanceOf(Immutable.List).isRequired,
    isValid: PropTypes.func,
    viewOnly: PropTypes.bool,
    onAdd: PropTypes.func,
    onRemove: PropTypes.func
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
    items :string[]
  }

  constructor(props :Object) {

    super(props);

    this.state = {
      inputValue: '',
      items: this.props.items
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

    return this.props.items.map((item :Map<string, string>) => {
      return (
        <StyledListItem key={item.get('id')}>
          <StyledElement>{ item.get('value') }</StyledElement>
          {
            this.props.viewOnly
              ? null
              : (
                <RemoveButton
                    onClick={() => {
                      this.removeItem(item.get('id'));
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
