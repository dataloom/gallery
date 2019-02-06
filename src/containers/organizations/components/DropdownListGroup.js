import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';
import Select from 'react-select';

import styles from './styles.css';
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

export default class DropdownListGroup extends React.Component {

  static propTypes = {
    placeholder: PropTypes.string,
    items: PropTypes.instanceOf(Immutable.List).isRequired,
    isValid: PropTypes.func,
    viewOnly: PropTypes.bool,
    noDelete: PropTypes.bool,
    options: PropTypes.array.isRequired,
    onAdd: PropTypes.func,
    onRemove: PropTypes.func
  };

  static defaultProps = {
    placeholder: '',
    viewOnly: false,
    noDelete: false,
    isValid: () => {},
    onAdd: () => {},
    onRemove: () => {}
  };

  constructor(props) {

    super(props);

    this.state = {
      inputValue: '',
      selectedPrincipalId: undefined,
      items: this.props.items
    };
  }

  addItem = () => {

    if (!this.state.selectedPrincipalId) {
      return;
    }

    this.props.onAdd({
      type: 'ORGANIZATION',
      id: this.state.selectedPrincipalId
    });

    this.setState({
      inputValue: '',
      selectedPrincipalId: undefined
    });
  }

  removeItem = (principal) => {

    this.props.onRemove(principal);
  }

  handleOnChange = (selectedOption) => {
    const { label, value } = selectedOption;

    this.setState({
      inputValue: label,
      selectedPrincipalId: value
    });
  }

  handleOnKeyDown = (event) => {

    switch (event.keyCode) {
      case 13: // 'Enter' key code
      case 27: // 'Esc' key code
        this.addItem();
        break;
      default:
        break;
    }
  }

  renderDropdownBox = () => {

    if (this.props.viewOnly) {
      return null;
    }

    return (
      <StyledListItem>
        <Select
            className={styles.trustedOrgSelect}
            options={this.props.options}
            value={this.state.selectedPrincipalId}
            onChange={this.handleOnChange}
            onKeyDown={this.handleOnKeyDown}
            placeholder={this.props.placeholder} />
        <AddButton onClick={this.addItem} />
      </StyledListItem>
    )
  }

  renderListItems = () => {

    return this.props.items.map((item) => {
      return (
        <StyledListItem key={item.get('principal')}>
          <StyledElement>{ item.get('value') }</StyledElement>
          {
            this.props.viewOnly || this.props.noDelete
              ? null
              : (
                <RemoveButton
                    onClick={() => {
                      this.removeItem(item.get('principal').toJS());
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
        { this.renderListItems() }
        { this.renderDropdownBox() }
      </StyledFlexContainerStacked>
    );
  }
}
