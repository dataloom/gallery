import React, { PropTypes } from 'react';
import styles from './styles.module.css';

import HeaderNav from '../../components/headernav/HeaderNav';
import SideNav from '../../components/sidenav/SideNav';

export class Container extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    children: PropTypes.element,
    route: PropTypes.object
  }

  static childContextTypes = {
    isAdmin: PropTypes.bool
  }

  constructor(props) {
    super(props);
    this.state = props.route.profileFn();
  }

  getChildContext() {
    return {
      isAdmin: this.props.route.profileFn().isAdmin
    };
  }

  updateState = () => {
    this.setState(this.props.route.profileFn());
  }

  getChildren() {
    let children = null;
    if (this.props.children) {
      children = React.cloneElement(this.props.children, {
        auth: this.props.route.auth,
        updateTopbarFn: this.updateState,
        profileFn: this.props.route.profileFn
      });
    }
    return children;
  }

  render() {

    return (
      <div className={styles.appWrapper}>
        <HeaderNav auth={this.props.route.auth} isAdmin={this.state.isAdmin} name={this.state.name} />
        <div className={styles.appBody}>
          <SideNav name={this.state.name} />
          <div className={styles.appContent}>
            { this.getChildren() }
          </div>
        </div>
      </div>
    );
  }
}

export default Container;
