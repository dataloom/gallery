import React, { PropTypes } from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import styles from '../styles.module.css';

export default class RowImage extends React.Component {
  static propTypes = {
    imgSrc: PropTypes.string.isRequired
  }

  renderImage = (className) => {
    return (
      <img
          src={`data:image/png;base64,${this.props.imgSrc}`}
          className={className}
          role="presentation"
          onClick={this.enlargeImage} />
    );
  }

  render() {
    const tooltip = <Tooltip>{this.renderImage(styles.enlargedImageData)}</Tooltip>;
    return (
      <div>
        <OverlayTrigger placement="top" overlay={tooltip}>
          {this.renderImage(styles.imgData)}
        </OverlayTrigger>
      </div>
    );
  }
}
