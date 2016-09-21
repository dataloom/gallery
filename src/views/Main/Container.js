import React, { PropTypes as T } from 'react';
import { Jumbotron } from 'react-bootstrap';
import styles from './styles.module.css';

export class Container extends React.Component {
  static contextTypes = {
    router: T.object
  }

  static propTypes = {
    children: T.element,
    route: T.object
  }

  getChildren() {
    let children = null;
    if (this.props.children) {
      children = React.cloneElement(this.props.children, {
        auth: this.props.route.auth // sends auth instance to children
      });
    }
    return children;
  }

  render() {
    const children = this.getChildren();
    return (
      <Jumbotron>
        <h2 className={styles.mainTitle}>
          <img src="https://cdn.auth0.com/styleguide/1.0.0/img/badge.svg" role="presentation" />
        </h2>
        {children}
      </Jumbotron>
    );
  }
}

export default Container;
