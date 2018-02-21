import React from 'react';

import StyledButton from './StyledButton';

export default class Button extends React.Component {

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    disabled: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    scStyle: React.PropTypes.string
  };

  render() {

    // TODO: this can be probably done better. look at react-bootstrap for inspiration
    if (this.props.disabled) {
      return (
        <StyledButton scStyle={this.props.scStyle} disabled>
          { React.Children.toArray(this.props.children) }
        </StyledButton>
      );
    }

    return (
      <StyledButton scStyle={this.props.scStyle} onClick={this.props.onClick}>
        { React.Children.toArray(this.props.children) }
      </StyledButton>
    );
  }
}
