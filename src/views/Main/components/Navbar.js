import React, { PropTypes } from 'react';
import '../styles.module.css';

export class Navbar extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    route: PropTypes.object
  }

  render() {
    return (
      <div className={'navbarContainer'}>
        <img src="https://cdn.auth0.com/styleguide/1.0.0/img/badge.svg" role="presentation" className={'logo'} />
        <div className={'loom'}>Loom</div>
      </div>
    );
  }
}

export default Navbar;
