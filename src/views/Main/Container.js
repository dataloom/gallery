import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import DocumentTitle from 'react-document-title';
import styles from './styles.module.css';

import HeaderNav from '../../components/headernav/HeaderNav';
import SideNav from '../../components/sidenav/SideNav';
import PageConsts from '../../utils/Consts/PageConsts';
import RequestPermissionsModal from '../../containers/permissions/components/RequestPermissionsModal';

class Container extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  static propTypes = {
    children: PropTypes.element,
    route: PropTypes.object,
    fullName: PropTypes.string.isRequired,
    googleId: PropTypes.string.isRequired
  };

  static childContextTypes = {
    isAdmin: PropTypes.bool
  };

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
  };

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
      <DocumentTitle title={PageConsts.DEFAULT_DOCUMENT_TITLE}>
        <div className={styles.appWrapper}>
          <RequestPermissionsModal />
          <HeaderNav
              auth={this.props.route.auth}
              isAdmin={this.state.isAdmin}
              name={this.state.name}
              fullName={this.props.fullName}
              googleId={this.props.googleId} />
          <div className={styles.appBody}>
            <SideNav name={this.state.name} />
            <div className={styles.appContent}>
              { this.getChildren() }
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

function mapStateToProps() {
  let fullName = '';
  let googleId = '';

  if (window.localStorage.profile) {
    const profile = JSON.parse(window.localStorage.profile);
    fullName = profile.name;
    googleId = profile.identities[0].user_id;
  }

  return {
    fullName,
    googleId
  };
}

export default connect(mapStateToProps)(Container);
