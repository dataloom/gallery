import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './styles.module.css';

export default class WelcomeInstructionsBox extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imgSrc: PropTypes.string.isRequired,
    linkRoute: PropTypes.string.isRequired
  };

  render() {
    const prop = this.props.propertyType;
    return (
      <Link className={styles.instructionsBox} to={`/${this.props.linkRoute}`}>
        <div className={styles.instructionsTitle}>{this.props.title}</div>
        <div className={styles.imgContainer}>
          <img className={styles.instructionsImg} src={this.props.imgSrc} role="presentation" />
        </div>
        <div className={styles.instructionsDescription}>{this.props.description}</div>
      </Link>
    );
  }
}
