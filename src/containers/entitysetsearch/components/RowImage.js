import React, { PropTypes } from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

import styles from '../styles.module.css';
import { IMAGE_HEADER } from '../../../utils/Consts/FileConsts';

export default class RowImage extends React.Component {
  static propTypes = {
    imgSrc: PropTypes.string.isRequired,
    tooltipId: PropTypes.string.isRequired
  }

  renderImage = (className) => {
    let { imgSrc } = this.props;
    if (!imgSrc.startsWith(IMAGE_HEADER)) {
      imgSrc = `${IMAGE_HEADER}${imgSrc}`;
    }
    return (
      <img
          src={imgSrc}
          className={className}
          onClick={this.enlargeImage} />
    );
  }

  render() {
    const tooltip = <Tooltip className={'imgtooltip'} placement="top" id={this.props.tooltipId}>{this.renderImage(styles.enlargedImageData)}</Tooltip>;
    return (
      <div>
        <OverlayTrigger placement="top" overlay={tooltip}>
          {this.renderImage(styles.imgData)}
        </OverlayTrigger>
      </div>
    );
  }
}
