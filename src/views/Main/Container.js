import React, { PropTypes } from 'react';
import { Jumbotron } from 'react-bootstrap';
import styles from './styles.module.css';
import { Navbar } from './components/Navbar';
import { Topbar } from './components/Topbar';

export class Container extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    children: PropTypes.element,
    route: PropTypes.object
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
        <Topbar auth={this.props.route.auth} isAdmin={this.props.route.isAdmin} name={this.props.route.name} />
        <Navbar auth={this.props.route.auth} />
        <div className={styles.bodyContainer}>
          <div className={styles.topSpacer} />
          {children}
        </div>
      </Jumbotron>
    );
  }
}

export default Container;
