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

  constructor(props) {
    super(props);
    this.state = props.route.profileFn();
  }

  componentDidMount() {
    this.updateState();
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
    const children = this.getChildren();
    return (
      <Jumbotron>
        <Topbar auth={this.props.route.auth} isAdmin={this.state.isAdmin} name={this.state.name} />
        <Navbar auth={this.props.route.auth} updateTopbarFn={this.props.route.profileFn} />
        <div className={styles.bodyContainer}>
          <div className={styles.topSpacer} />
          {children}
        </div>
      </Jumbotron>
    );
  }
}

export default Container;
