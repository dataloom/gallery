import React, { PropTypes } from 'react';
import { Jumbotron } from 'react-bootstrap';
import Loom from 'loom-data';
import styles from './styles.module.css';
import { Navbar } from './components/Navbar';

export class Container extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    children: PropTypes.element,
    route: PropTypes.object
  }

  constructor() {
    super();
    Loom.configure({ baseUrl: 'localhost' });
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
        <Navbar auth={this.props.route.auth} />
        <div className={styles.topSpacer} />
        {children}
      </Jumbotron>
    );
  }
}

export default Container;
