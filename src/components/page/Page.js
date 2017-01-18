import React, { PropTypes } from 'react';
import classnames from 'classnames';
import styles from './page.module.css';

const basePropTypes = {
  className: PropTypes.string
};

class Page extends React.Component {
  static propTypes = basePropTypes;

  render() {
    return (
      <div className={classnames(styles.page, this.props.className)}>
        {this.props.children}
      </div>
    );
  }
}

class Header extends React.Component {
  static propTypes = basePropTypes;

  render() {
    return (
      <header className={styles.header}>
        <div className={classnames(styles.content, this.props.className)}>
          {this.props.children}
        </div>
      </header>
    );
  }
}

class Title extends React.Component {
  static propTypes = basePropTypes;

  render() {
    return (
      <h1 className={classnames(styles.title, this.props.className)}>{this.props.children}</h1>
    );
  }
}

class Body extends React.Component {
  static propTypes = basePropTypes;

  render() {
    return (
      <div className={classnames(styles.content, this.props.className)}>
        {this.props.children}
      </div>
    );
  }
}


Page.Header = Header;
Page.Title = Title;
Page.Body = Body;

export default Page;