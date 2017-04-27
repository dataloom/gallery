import React from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';

import SecureFieldView from './SecureFieldView';

export default class SecureField extends React.Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);

    this.state = {
      value: '',
      copied: false
    };
  }

  render () {
    return (
      <SecureFieldView
          value={this.state.value}
          copied={this.state.copied}
          content={this.props.content} />
    );
  }
}
