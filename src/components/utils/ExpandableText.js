import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import styles from './expandabletext.module.css';

export default class ExpandableText extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    maxLength: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };

    this.switchState = () => {
      this.setState({ isOpen: !this.state.isOpen });
    };
  }

  render() {
    const { text, maxLength } = this.props;
    if (text.length <= maxLength) {
      return (<div>{text}</div>);
    }

    const { isOpen } = this.state;
    let controlText,
      displayText;
    if (isOpen) {
      controlText = 'Read less';
      displayText = text;
    } else {
      controlText = 'Read more';
      displayText = `${text.substring(0, maxLength)}...`;
    }

    return (
      <div>
        {displayText}
        <Button bsStyle="link" className={styles.expandTextButton} onClick={this.switchState}>{controlText}</Button>
      </div>
    );

  }
}