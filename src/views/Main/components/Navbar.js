import React, { PropTypes } from 'react';

export class Navbar extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    route: PropTypes.object
  }

  render() {
    return (
      <div style={{ height: '50', background: 'gray', width: '100%', top: '0', position: 'absolute' }}>
        <img src="https://cdn.auth0.com/styleguide/1.0.0/img/badge.svg" role="presentation" style={{ maxWidth: '90%', maxHeight: '90%', paddingLeft: '15' }} />
        <div style={{ display: 'inline-block', color: '#f6f6f6', fontSize: '30', verticalAlign: 'middle', paddingLeft: '15' }}>Loom</div>
      </div>
    );
  }
}

export default Navbar;
